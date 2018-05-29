using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Security;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using Microsoft.SharePoint.Client;

namespace Migracion
{
    public struct Field
    {
        [XmlAttribute]
        public string Title;

        [XmlAttribute]
        public string InternalName;

        [XmlAttribute]
        public string Value;

        [XmlAttribute]
        public string FieldType;

        [XmlAttribute]
        public string LookupList;

        [XmlAttribute]
        public string LookupField;

        [XmlAttribute]
        public string[] Choices;
    }

    public struct Item
    {
        public List<Field> Fields;
    }

    class Program
    {
        static int itemCounter = 0;
        static int itemLimit = 100;
        static Hashtable htLookupLists = new Hashtable();
        static ArrayList lookupLists = new ArrayList();
        static Microsoft.SharePoint.Client.ListItemCollectionPosition itemPosition;
        static System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(typeof(List<Item>));
        static string importSite = "";

        static bool createLookupLists = true;

        static void Main(string[] args)
        {
            string siteUrl = GetParamValue(args, "-site");
            string operation = GetParamValue(args, "-command");
            string listTitle = GetParamValue(args, "-list");
            string lookuplists = GetParamValue(args, "-lookuplists");

            if (!string.IsNullOrEmpty(lookuplists))
                createLookupLists = Convert.ToBoolean(lookuplists);

            importSite = GetParamValue(args, "-site");

            if (operation == "export")
            {
                if (string.IsNullOrEmpty(listTitle))
                    Export(siteUrl);
                else
                    Export(siteUrl, listTitle);
            }
            else if (operation == "import")
            {
                if (string.IsNullOrEmpty(listTitle))
                    Import(siteUrl);
                else
                    Import(siteUrl, listTitle);
                
            }
        }

        #region Export

        private static void Export(string siteUrl)
        {
            GetLists(siteUrl);
        }

        private static void Export(string siteUrl, string listTitle)
        {
            ClientContext context = new ClientContext(siteUrl);
            context.Credentials = new System.Net.NetworkCredential("vassdesk\\intranet1", "Lunes.123");
            context.ExecutingWebRequest += delegate (object sender, WebRequestEventArgs e)
            {
                e.WebRequestExecutor.WebRequest.UserAgent = "NONISV|Contoso|GovernanceCheck/1.0";
            };

            GetItems(context, listTitle);
            Console.Read();
        }

        private static void GetLists(string siteUrl)
        {
            Console.WriteLine("Conectando a {0}", siteUrl);

            ClientContext context = new ClientContext(siteUrl);
            context.Credentials = new System.Net.NetworkCredential("vassdesk\\intranet1", "Lunes.123");
            context.ExecutingWebRequest += delegate (object sender, WebRequestEventArgs e)
            {
                e.WebRequestExecutor.WebRequest.UserAgent = "NONISV|Contoso|GovernanceCheck/1.0";
            };

            Web web = context.Web;

            context.Load(web.Lists, lists => lists.Include(list => list.Title, list => list.Id, list => list.RootFolder, list => list.BaseType));

            context.ExecuteQuery();

            foreach (List list in web.Lists)
            {
                //if (list.BaseType == BaseType.DocumentLibrary)
                //{
                //    Console.WriteLine("Obteniendo ficheros de {0}", list.Title);
                //    GetFiles(list.RootFolder, context, list.Title, @"C:\Proyectos\Avantgarde\VASS\Vass.Intranet\Migracion\bin\Debug\xml\docs");
                //}

                if (list.BaseType != BaseType.DocumentLibrary)
                {
                    itemCounter = 0;
                    Console.WriteLine();
                    GetItems(context, list.Title);
                }

            }

            Console.WriteLine();
            Console.WriteLine("Fin");
            Console.Read();
        }

        private static void GetItems(ClientContext context, string listTitle)
        {
            try
            {
                string path = Path.Combine(System.Configuration.ConfigurationManager.AppSettings["path"], listTitle);

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                List list = context.Web.Lists.GetByTitle(listTitle);

                CamlQuery query = new CamlQuery();

                query = CamlQuery.CreateAllItemsQuery(itemLimit);
                query.ListItemCollectionPosition = itemPosition;

                ListItemCollection items = list.GetItems(query);

                context.Load(list);
                context.Load(items);
                context.Load(list.Fields);

                context.ExecuteQuery();

                itemPosition = items.ListItemCollectionPosition;

                int itemCount = list.ItemCount;
                int queryItems = items.Count;

                if (queryItems > 0)
                {
                    List<Item> listItems = new List<Item>();

                    foreach (ListItem listItem in items)
                    {
                        List<Field> fields = new List<Field>();

                        foreach (Microsoft.SharePoint.Client.Field field in list.Fields)
                        {
                            if (!field.Hidden && !field.ReadOnlyField)
                            {
                                Field f = new Field();
                                f.Title = field.Title;
                                f.InternalName = field.InternalName;
                                f.FieldType = field.TypeAsString;

                                try
                                {
                                    if (field.FieldTypeKind == FieldType.Lookup)
                                    {
                                        FieldLookupValue lookup = listItem[field.InternalName] as FieldLookupValue;
                                        FieldLookup fLookup = (FieldLookup)field;
                                        f.Value = lookup.LookupValue;

                                        if (!string.IsNullOrEmpty(fLookup.LookupList))
                                        {
                                            if (!htLookupLists.ContainsKey(fLookup.LookupList))
                                            {
                                                string lookupList = GetListTitle(context, fLookup.LookupList);
                                                htLookupLists.Add(fLookup.LookupList, lookupList);
                                            }

                                            f.LookupList = htLookupLists[fLookup.LookupList].ToString();
                                        }

                                        f.LookupField = fLookup.LookupField;
                                    }
                                    else if (field.FieldTypeKind == FieldType.User)
                                    {
                                        FieldUserValue user = listItem[field.InternalName] as FieldUserValue;
                                        f.Value = user.LookupValue;
                                    }
                                    else if (field.FieldTypeKind == FieldType.Choice)
                                    {
                                        FieldChoice choice = field as FieldChoice;
                                        f.Choices = choice.Choices;
                                        f.Value = listItem[field.InternalName].ToString();
                                    }
                                    else
                                    {
                                        f.Value = listItem[field.InternalName].ToString();
                                    }

                                }
                                catch
                                {
                                    f.Value = string.Empty;
                                }

                                fields.Add(f);
                            }
                            
                        }

                        Item item = new Item();
                        item.Fields = fields;
                        listItems.Add(item);

                        itemCounter++;

                        int percentage = (itemCounter * 100) / itemCount;

                        string msg = string.Format("Obteniendo elementos de {0}... {1}%\r", listTitle, percentage);
                        Console.Write(msg);
                    }

                    CreateXml(path, listTitle, listItems);

                    if (itemPosition != null)
                    {
                        GetItems(context, listTitle);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        private static void CreateXml(string path, string listTitle, List<Item> listItems)
        {
            string filePath = string.Format("{0}\\{1}.xml", path, listTitle);
            if (System.IO.File.Exists(filePath))
            {
                for (var i = 1; i < int.MaxValue; i++)
                {
                    string fileName = listTitle + "_" + i;
                    filePath = string.Format("{0}\\{1}.xml", path, fileName);

                    if (!System.IO.File.Exists(filePath))
                        break;
                }
            }


            System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(typeof(List<Item>));

            using (StreamWriter sw = new StreamWriter(filePath, true))
            {
                using (XmlWriter writer = XmlWriter.Create(sw))
                {
                    serializer.Serialize(writer, listItems);
                }

                sw.Flush();
            }
        }

        private static void DownloadFiles(Folder mainFolder, ClientContext clientContext, string listTitle, string pathString)
        {
            clientContext.Load(mainFolder, k => k.Files, k => k.Folders);
            clientContext.ExecuteQuery();

            foreach (var folder in mainFolder.Folders)
            {
                DownloadFiles(folder, clientContext, listTitle, pathString);
            }

            int filesCount = mainFolder.Files.Count;
            int counter = 0;

            foreach (var file in mainFolder.Files)
            {
                var fileRef = file.ServerRelativeUrl;
                var fileInfo = Microsoft.SharePoint.Client.File.OpenBinaryDirect(clientContext, fileRef);
                var fileName = Path.Combine(pathString, listTitle, mainFolder.Name);

                Directory.CreateDirectory(fileName);
                fileName = Path.Combine(fileName, file.Name);

                using (var fileStream = System.IO.File.Create(fileName))
                {
                    fileInfo.Stream.CopyTo(fileStream);
                }

                counter++;
                int percentage = (counter * 100) / filesCount;

                string msg = string.Format("Descargando ficheros de {0}... {1}%\r", mainFolder.Name, percentage);

                if (counter < filesCount)
                    Console.Write(msg);
                else
                    Console.WriteLine(msg);

            }
        }

        private static string GetListTitle(ClientContext context, string listId)
        {
            List list = context.Web.Lists.GetById(new Guid(listId));

            context.Load(list);

            context.ExecuteQuery();

            return list.Title;
        }

        private static string CreateInternalName(string fieldTitle)
        {
            Regex reg = new Regex("[^a-zA-Z0-9 ]");
            string internalName = fieldTitle.Replace(" ", "");
            internalName = internalName.Normalize(NormalizationForm.FormD);
            internalName = reg.Replace(internalName, "");

            return internalName;

        }
        #endregion

        #region Import
        private static void Import(string siteUrl)
        {
            importSite = siteUrl;

            ClientContext context = new ClientContext(siteUrl);
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

            string path = System.Configuration.ConfigurationManager.AppSettings["path"];

            DirectoryInfo di = new DirectoryInfo(path);
            DirectoryInfo[] directories = di.GetDirectories();

            foreach (DirectoryInfo directory in directories)
            {
                CreateList(context, directory.Name);
            }

            Console.WriteLine("Fin");
            Console.Read();
        }

        private static void Import(string siteUrl, string listTitle)
        {
            importSite = siteUrl;

            ClientContext context = new ClientContext(siteUrl);
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

            CreateList(context, listTitle);

            Console.WriteLine("Fin");
            Console.Read();
        }

        private static void CreateList(ClientContext context, string listTitle)
        {
            try
            {
                string path = System.Configuration.ConfigurationManager.AppSettings["path"];

                DirectoryInfo directory = new DirectoryInfo(Path.Combine(path, listTitle));

                Console.WriteLine("Creando lista {0}", listTitle);

                if (createLookupLists)
                    EnsureLookupList(context, listTitle);

                EnsureNewList(context, listTitle);

                Web web = context.Web;

                ListCreationInformation creationInfo = new ListCreationInformation();
                creationInfo.Title = listTitle;
                creationInfo.TemplateType = (int)ListTemplateType.GenericList;
                List list = web.Lists.Add(creationInfo);

                list.Update();
                context.ExecuteQuery();

                CheckFiles(context, list, directory);
            }
            catch(Exception ex)
            {

            }
        }

        private static void CheckFiles(ClientContext context, List list, DirectoryInfo directory)
        {
            FileInfo[] files = directory.GetFiles();
            FileInfo file = files[0];

            List<Item> items = null;
            System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(typeof(List<Item>));
            using (StreamReader sr = new StreamReader(file.FullName))
            {
                items = serializer.Deserialize(sr) as List<Item>;
            }

            CreateFields(context, list, items[1].Fields);

            CreateItems(directory, list.Title);
        }

        private static void CreateItems(DirectoryInfo directory, string listTitle)
        {
            Console.WriteLine("Obteniendo elementos a cargar...");

            FileInfo[] files = directory.GetFiles();
            List<Item> items = new List<Item>();

            //Obtenemos todos los elementos
            foreach(FileInfo file in files)
            {
                System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(typeof(List<Item>));
                using (StreamReader sr = new StreamReader(file.FullName))
                {
                    items.AddRange(serializer.Deserialize(sr) as List<Item>);
                }
            }

            int counter = 0;
            int length = items.Count;
            int percentage = 0;

            Console.WriteLine("Elementos a cargar {0}", length);
            Console.WriteLine("Conectando a {0}", importSite);

            ClientContext context = new ClientContext(importSite);
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

            List list = context.Web.Lists.GetByTitle(listTitle);
            FieldCollection listFields = list.Fields;

            context.Load(listFields, fields => fields.Include(field => field.Title, field => field.InternalName));
            context.ExecuteQuery();

            foreach (Item item in items)
            {
                ListItemCreationInformation itemCreateInfo = new ListItemCreationInformation();
                ListItem listItem = list.AddItem(itemCreateInfo);

                foreach (Field field in item.Fields)
                {
                    try
                    {
                        if (!string.IsNullOrEmpty(field.Value))
                        {
                            if (field.Title != "ID" && field.InternalName != "ContentType" && field.InternalName != "Attachments")
                            {
                                var targetField = listFields.FirstOrDefault(f => f.Title == field.Title);
                                if (targetField != null)
                                {
                                    switch (field.FieldType)
                                    {
                                        case "DateTime":
                                            listItem[targetField.InternalName] = Convert.ToDateTime(field.Value);
                                            break;
                                        case "Lookup":
                                            FieldLookupValue lv = GetLookupValue(field.LookupList, field.LookupField, field.Value);
                                            listItem[targetField.InternalName] = lv;
                                            break;
                                        default:
                                            listItem[targetField.InternalName] = field.Value;
                                            break;

                                    }
                                }
                            }
                        }                        
                    }
                    catch(Exception ex)
                    {
                        Console.WriteLine(ex.ToString());
                    }
                }

                listItem.Update();
                context.ExecuteQuery();

                counter++;
                percentage = (counter * 100) / length;
                Console.Write("Creando elementos en {0}...{1}%\r", listTitle, percentage);
            }
        }

        private static FieldLookupValue GetLookupValue(string listTitle, string fieldName, string fieldValue)
        {
            ClientContext clientContext = new ClientContext(importSite);
            clientContext.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

            List list = clientContext.Web.Lists.GetByTitle(listTitle);
            FieldCollection fields = list.Fields;
            CamlQuery camlQueryForItem = new CamlQuery();
            camlQueryForItem.ViewXml = string.Format(@"<View>
                                    <Query>
                                        <Where>
                                            <Eq>
                                                <FieldRef Name='{0}'/>
                                                <Value Type='Text'>{1}</Value>
                                            </Eq>
                                        </Where>
                                    </Query>
                                </View>", fieldName, fieldValue);

            ListItemCollection listItems = list.GetItems(camlQueryForItem);
            clientContext.Load(listItems);
            clientContext.ExecuteQuery();
            ListItem item = listItems[0];

            FieldLookupValue lv = new FieldLookupValue();
            lv.LookupId = Convert.ToInt32(item["ID"]);

            return lv;
        }

        private static ArrayList CreateFields(ClientContext context, List list, List<Field> fields)
        {
            ArrayList createdFields = new ArrayList();
            int counter = 0;
            int length = fields.Count;
            int percentage = 0;
            foreach (Field field in fields)
            {
                bool created = CreateField(context, list, field);
                if (created)
                    createdFields.Add(field.InternalName);

                counter++;
                percentage = (counter * 100) / length;

                Console.Write("Creando campos en {0}...{1}%\r", list.Title, percentage);
            }

            Console.WriteLine();

            return createdFields;
        }

        private static bool CreateField(ClientContext context, List list, Field field)
        {
            try
            {
                System.Collections.Hashtable listIds = new Hashtable();

                string schemaTextField = string.Empty;

                switch (field.FieldType) {
                    case "Lookup":
                        if (!string.IsNullOrEmpty(field.LookupList))
                        {
                            if(!listIds.Contains(field.LookupList))
                            {
                                string listId = GetListId(field.LookupList);
                                listIds.Add(field.LookupList, listId);
                            }

                            schemaTextField = string.Format("<Field Type='{0}' Name='{1}' StaticName='{1}' DisplayName='{2}' List='{3}' ShowField='{4}'/>", field.FieldType, field.InternalName, field.Title, listIds[field.LookupList], field.LookupField);
                        }
                        break;
                    case "Choice":
                        schemaTextField = string.Format("<Field Type='{0}' Name='{1}' StaticName='{1}' DisplayName='{2}'><CHOICES>", field.FieldType, field.InternalName, field.Title, field.LookupList, field.LookupField);
                        for(int i = 0; i < field.Choices.Length; i++)
                        {
                            schemaTextField += string.Format("<CHOICE>{0}</CHOICE>", field.Choices[i]);

                        }
                        schemaTextField += "</CHOICES></Field>";
                        break;
                    default:
                        schemaTextField = string.Format("<Field Type='{0}' Name='{1}' StaticName='{1}' DisplayName='{2}' />", field.FieldType, field.InternalName, field.Title);
                        break;
                }

                if (!string.IsNullOrEmpty(schemaTextField))
                {
                    Microsoft.SharePoint.Client.Field newField = list.Fields.AddFieldAsXml(schemaTextField, true, AddFieldOptions.AddFieldCheckDisplayName);
                    context.ExecuteQuery();

                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        private static string GetListId(string listTitle)
        {
            ClientContext context = new ClientContext(importSite);
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

            List list = context.Web.Lists.GetByTitle(listTitle);

            context.Load(list);

            context.ExecuteQuery();

            return list.Id.ToString();
        }

        private static void EnsureNewList(ClientContext context, string listTitle)
        {
            try
            {
                Web web = context.Web;

                List list = web.Lists.GetByTitle(listTitle);
                list.DeleteObject();

                context.ExecuteQuery();
            }
            catch (Exception ex)
            {

            }

        }

        private static void EnsureLookupList(ClientContext context, string listTitle)
        {
            Console.WriteLine("Comprobando dependencias...");

            string path = System.Configuration.ConfigurationManager.AppSettings["path"];
            DirectoryInfo directory = new DirectoryInfo(Path.Combine(path, listTitle));

            FileInfo[] files = directory.GetFiles();

            foreach (FileInfo file in files)
            {
                try
                {
                    using (Stream sr = new FileStream(file.FullName, FileMode.Open))
                    {
                        using (Stream bs = new BufferedStream(sr))
                        {
                            List<Item> items = serializer.Deserialize(bs) as List<Item>;
                            Item item = items[1];
                            List<Field> fields = item.Fields;

                            foreach (Field field in fields)
                            {
                                if (!string.IsNullOrEmpty(field.LookupList))
                                {
                                    if (!lookupLists.Contains(field.LookupList))
                                    {
                                        lookupLists.Add(field.LookupList);
                                        CreateList(context, field.LookupList);
                                    }
                                }
                            }
                        }

                    }
                }
                catch (Exception ex)
                {

                }
            }
        }

        private static SecureString GetSecureString()
        {
            string pwd = "Lunes.123";
            char[] chars = pwd.ToCharArray();
            SecureString securePassword = new SecureString();

            for (int i = 0; i < chars.Length; i++)
            {
                securePassword.AppendChar(chars[i]);
            }

            return securePassword;
        }
        #endregion

        private static string GetParamValue(string[] args, string parameter)
        {
            string value = string.Empty;
            string param = parameter;

            if (!param.StartsWith("-"))
                param = "-" + param;

            for (var i = 0; i < args.Length; i++)
            {
                if (args[i] == param)
                {
                    value = args[i + 1];
                    break;
                }
            }

            return value;
        }
    }
}
