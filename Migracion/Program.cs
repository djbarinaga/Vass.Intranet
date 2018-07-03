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
        [XmlAttribute]
        public string Folder;

        public List<Field> Fields;
    }

    public struct File
    {
        [XmlAttribute]
        public string Name;

        [XmlAttribute]
        public string Path;
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
        static List<File> files = new List<File>();

        static bool createLookupLists = false;

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

            GetItems(context, listTitle);
            Console.Read();
        }

        private static void GetLists(string siteUrl)
        {
            Console.WriteLine("Conectando a {0}", siteUrl);

            ClientContext context = new ClientContext(siteUrl);
            context.Credentials = new System.Net.NetworkCredential("vassdesk\\intranet1", "Lunes.123");

            Web web = context.Web;

            context.Load(web.Lists, lists => lists.Include(list => list.Title, list => list.Id, list => list.RootFolder, list => list.BaseType));

            context.ExecuteQuery();

            foreach (List list in web.Lists)
            {
                

                files = new List<File>();

                //if (list.BaseType == BaseType.DocumentLibrary)
                //{
                //    Console.WriteLine("Obteniendo ficheros de {0}", list.Title);
                //    GetFiles(list.RootFolder, context, Path.Combine(System.Configuration.ConfigurationManager.AppSettings["path"], list.Title));


                //}

                if(list.BaseType != BaseType.DocumentLibrary)
                {
                    Console.WriteLine("Obteniendo elementos de {0}", list.Title);
                    GetItems(context, list.RootFolder, list, Path.Combine(System.Configuration.ConfigurationManager.AppSettings["path"], list.Title));
                }
                

                if (files.Count > 0)
                {
                    System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(typeof(List<File>));

                    using (StreamWriter sw = new StreamWriter(Path.Combine(System.Configuration.ConfigurationManager.AppSettings["path"], list.Title, "files.xml"), true))
                    {
                        using (XmlWriter writer = XmlWriter.Create(sw))
                        {
                            serializer.Serialize(writer, files);
                        }

                        sw.Flush();
                    }
                }

            }

            Console.WriteLine();
            Console.WriteLine("Fin");
            Console.Read();
        }

        private static void GetFiles(Folder mainFolder, ClientContext clientContext, string pathString)
        {
            clientContext.Load(mainFolder, k => k.Files, k => k.Folders);
            clientContext.ExecuteQuery();

            foreach (var folder in mainFolder.Folders)
            {
                GetFiles(folder, clientContext, pathString);
            }

            int counter = 0;
            int itemCount = mainFolder.Files.Count;

            if (itemCount == 0)
                Console.WriteLine("No hay ficheros en {0}", mainFolder.ServerRelativeUrl);
            else
            {
                System.IO.Directory.CreateDirectory(pathString);
                Console.Write("Obteniendo ficheros de {0}...\r", mainFolder.ServerRelativeUrl);
            }

            foreach (var file in mainFolder.Files)
            {
                var fileRef = file.ServerRelativeUrl;
                var fileInfo = Microsoft.SharePoint.Client.File.OpenBinaryDirect(clientContext, fileRef);
                var fileName = Path.Combine(pathString, file.Name);

                files.Add(new File() { Name = file.Name, Path = mainFolder.ServerRelativeUrl });

                using (var fileStream = System.IO.File.Create(fileName))
                {
                    fileInfo.Stream.CopyTo(fileStream);
                    fileStream.Close();
                }

                counter++;

                int percentage = (counter * 100) / itemCount;

                if (counter < itemCount)
                    Console.Write("Obteniendo ficheros de {0}... {1}%\r", mainFolder.ServerRelativeUrl, percentage);
                else
                    Console.WriteLine("Obteniendo ficheros de {0}... {1}%\r", mainFolder.ServerRelativeUrl, percentage);
            }

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

        private static void GetItems(ClientContext context, Folder mainFolder, List list, string pathString)
        {
            string listTitle = list.Title;
            try
            {
                context.Load(mainFolder, k => k.Folders);
                context.ExecuteQuery();

                foreach (var folder in mainFolder.Folders)
                {
                    string folderPath = Path.Combine(pathString, folder.Name);
                    if (list.BaseType == BaseType.DocumentLibrary)
                        folderPath = pathString;

                    GetItems(context, folder, list, folderPath);
                }

                CamlQuery query = new CamlQuery();
                //query = CamlQuery.CreateAllItemsQuery();
                query.ViewXml = "<View><Query><Neq><FieldRef Name='ContentType'/><Value Type='Text'>Folder</Value></Neq></Query></View>";
                query.FolderServerRelativeUrl = mainFolder.ServerRelativeUrl;
                query.ListItemCollectionPosition = itemPosition;

                ListItemCollection items = list.GetItems(query);
                FileCollection fileCol = context.Web.GetFolderByServerRelativeUrl(mainFolder.ServerRelativeUrl).Files;

                context.Load(list);
                context.Load(items);
                context.Load(list.Fields);
                context.Load(fileCol);

                context.ExecuteQuery();

                itemPosition = items.ListItemCollectionPosition;

                int queryItems = items.Count;
                itemCounter = 0;

                if (queryItems > 0)
                {
                    string msg = string.Format("Obteniendo elementos de {0}... 0%\r", mainFolder.ServerRelativeUrl);
                    Console.Write(msg);

                    List<Item> listItems = new List<Item>();

                    foreach (ListItem listItem in items)
                    {
                        List<Field> fields = new List<Field>();

                        if(listItem["ContentTypeId"] != null && !listItem["ContentTypeId"].ToString().Contains("0x012000"))
                        {
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
                                            FieldLookup fLookup = (FieldLookup)field;
                                            if (fLookup.AllowMultipleValues)
                                            {
                                                FieldLookupValue[] lookupMulti = listItem[field.InternalName] as FieldLookupValue[];

                                                ArrayList lookupValues = new ArrayList();

                                                foreach (var lookupValue in lookupMulti)
                                                {
                                                    lookupValues.Add(lookupValue.LookupValue);
                                                }

                                                f.Value = string.Join(";#", lookupValues.ToArray());
                                            }
                                            else
                                            {
                                                FieldLookupValue lookup = listItem[field.InternalName] as FieldLookupValue;
                                                f.Value = lookup.LookupValue;
                                            }
                                                

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
                                        else if (field.FieldTypeKind == FieldType.MultiChoice)
                                        {
                                            FieldMultiChoice choice = field as FieldMultiChoice;
                                            f.Choices = choice.Choices;
                                            f.Value = string.Join(";#", (string[])listItem[field.InternalName]);
                                        }
                                        else if (field.FieldTypeKind == FieldType.URL)
                                        {
                                            FieldUrlValue url = listItem[field.InternalName] as FieldUrlValue;
                                            f.Value = url.Url;
                                        }
                                        else
                                        {
                                            f.Value = listItem[field.InternalName].ToString();
                                        }

                                    }
                                    catch(Exception ex)
                                    {
                                        f.Value = string.Empty;
                                    }

                                    fields.Add(f);
                                }

                            }

                            if (list.BaseType == BaseType.DocumentLibrary)
                            {

                                Microsoft.SharePoint.Client.File file = listItem.File;
                                if (file != null)
                                {
                                    if (context.HasPendingRequest)
                                        context.ExecuteQuery();

                                    if (!Directory.Exists(pathString))
                                        Directory.CreateDirectory(pathString);

                                    string fileUrl = string.Format("{0}/{1}", mainFolder.ServerRelativeUrl, listItem["FileLeafRef"]);
                                    FileInformation fileInfo = Microsoft.SharePoint.Client.File.OpenBinaryDirect(context, fileUrl);
                                    string fileName = Path.Combine(pathString, listItem["FileLeafRef"].ToString());

                                    using (FileStream fileStream = System.IO.File.Create(fileName))
                                    {
                                        fileInfo.Stream.CopyTo(fileStream);
                                        fileStream.Close();
                                    }
                                }
                            }

                            Item item = new Item();
                            item.Fields = fields;
                            item.Folder = mainFolder.ServerRelativeUrl;
                            listItems.Add(item);

                            itemCounter++;

                            int percentage = (itemCounter * 100) / queryItems;

                            msg = string.Format("Obteniendo elementos de {0}... {1}%\r", mainFolder.ServerRelativeUrl, percentage);
                            if (percentage < 100)
                                Console.Write(msg);
                            else
                                Console.WriteLine(msg);
                        }
                    }

                    if (listItems.Count > 0)
                    {
                        if (!Directory.Exists(pathString))
                            Directory.CreateDirectory(pathString);

                        CreateXml(pathString, listTitle, listItems);
                    }
                    else
                    {
                        msg = string.Format("Obteniendo elementos de {0}... 1000%", mainFolder.ServerRelativeUrl);
                        Console.WriteLine(msg);
                    }

                    if (itemPosition != null)
                    {
                        GetItems(context, mainFolder, list, pathString);
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

                //if (createLookupLists)
                //    EnsureLookupList(context, listTitle);

                //EnsureNewList(context, listTitle);

                Web web = context.Web;

                //ListCreationInformation creationInfo = new ListCreationInformation();
                //creationInfo.Title = listTitle;
                //creationInfo.TemplateType = (int)ListTemplateType.DocumentLibrary;
                //List list = web.Lists.Add(creationInfo);

                //list.Update();

                List list = web.Lists.GetByTitle(listTitle);
                context.Load(list);
                context.ExecuteQuery();

                //CheckFiles(context, list, directory);

                CreateItems(directory, list.Title);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        private static void CheckFiles(ClientContext context, List list, DirectoryInfo directory)
        {
            FileInfo[] files = directory.GetFiles(string.Format("{0}*.xml", list.Title));

            while (files.Length == 0)
            {
                directory = directory.GetDirectories()[0];
                files = directory.GetFiles(string.Format("{0}*.xml", list.Title));
            }

            FileInfo file = files[0];

            List<Item> items = null;
            System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(typeof(List<Item>));
            using (StreamReader sr = new StreamReader(file.FullName))
            {
                items = serializer.Deserialize(sr) as List<Item>;
            }

            CreateFields(context, list, items[0].Fields);
        }

        private static void CreateItems(DirectoryInfo directory, string listTitle)
        {
            string currentDirectory = directory.Name;

            DirectoryInfo[] directories = directory.GetDirectories();

            foreach(DirectoryInfo dir in directories)
            {
                CreateItems(dir, listTitle);
            }


            FileInfo[] files = directory.GetFiles(string.Format("{0}*.xml", listTitle));
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

            ClientContext context = new ClientContext(importSite);
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

            List list = context.Web.Lists.GetByTitle(listTitle);
            Folder rootFolder = list.RootFolder;

            context.Load(list);
            context.Load(rootFolder);
            context.ExecuteQuery();

            string folderUrl = rootFolder.ServerRelativeUrl;
            ListItemCreationInformation itemCreateInfo = new ListItemCreationInformation();

            if (!currentDirectory.Equals(listTitle, StringComparison.InvariantCultureIgnoreCase))
            {

                itemCreateInfo.UnderlyingObjectType = FileSystemObjectType.Folder;
                itemCreateInfo.LeafName = directory.Name;

                ListItem newItem = list.AddItem(itemCreateInfo);
                newItem["Title"] = directory.Name;
                newItem.Update();
                context.ExecuteQuery();

                folderUrl = list.RootFolder.ServerRelativeUrl + '/' + directory.Name;
            }
            
            FieldCollection listFields = list.Fields;

            context.Load(listFields, fields => fields.Include(field => field.Title, field => field.InternalName));
            context.ExecuteQuery();

            foreach (Item item in items)
            {
                try
                {
                    Console.WriteLine();

                    if (list.BaseType == BaseType.DocumentLibrary)
                    {
                        context = new ClientContext(importSite);
                        context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());
                    }

                    itemCreateInfo = new ListItemCreationInformation();

                    if (!currentDirectory.Equals(listTitle, StringComparison.InvariantCultureIgnoreCase))
                        itemCreateInfo.FolderUrl = folderUrl;
                    else if (item.Folder != null && list.BaseType == BaseType.DocumentLibrary)
                        itemCreateInfo.FolderUrl = item.Folder;

                    ListItem listItem;

                    if (list.BaseType == BaseType.DocumentLibrary)
                    {
                        string fileName = GetItemValue(item, "FileLeafRef");
                        string filePath = Path.Combine(directory.FullName, fileName);

                        Microsoft.SharePoint.Client.File file = UploadFileSlicePerSlice(context, list, directory, item);

                        listItem = file.ListItemAllFields;
                    }
                    else
                    {
                        listItem = list.AddItem(itemCreateInfo);
                    }

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
                                                if (lv != null)
                                                    listItem[targetField.InternalName] = lv;
                                                break;
                                            case "LookupMulti":
                                                string[] values = field.Value.Split(new string[] { ";#" }, StringSplitOptions.RemoveEmptyEntries);

                                                List<FieldLookupValue> lookupValues = new List<FieldLookupValue>();
                                                ArrayList al = new ArrayList();

                                                for(int i = 0; i < values.Length; i++)
                                                {
                                                    FieldLookupValue lvMulti = GetLookupValue(field.LookupList, field.LookupField, values[i]);
                                                    if (lvMulti != null)
                                                    {
                                                        lookupValues.Add(lvMulti);
                                                        al.Add(lvMulti.LookupId);
                                                        al.Add(values[i]);
                                                    }
                                                }

                                                listItem.ParseAndSetFieldValue(targetField.InternalName, null);
                                                listItem.Update();
                                                listItem[targetField.InternalName] = lookupValues.ToArray();
                                                listItem.Update();


                                                break;
                                            default:
                                                listItem[targetField.InternalName] = field.Value;
                                                break;

                                        }
                                    }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.ToString());
                        }
                    }

                    listItem.Update();

                    context.ExecuteQuery();

                    //if (list.BaseType != BaseType.DocumentLibrary)
                    //    context.ExecuteQuery();

                    if (list.BaseType != BaseType.DocumentLibrary)
                    {
                        counter++;
                        percentage = (counter * 100) / length;
                        Console.Write("Creando elementos en {0}...{1}%\r", folderUrl, percentage);
                    }
                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                }
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
            
            if(listItems.Count > 0)
            {
                ListItem item = listItems[0];

                FieldLookupValue lv = new FieldLookupValue();
                lv.LookupId = Convert.ToInt32(item["ID"]);

                return lv;
            }


            return null;
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
                    case "LookupMulti":
                        if (!string.IsNullOrEmpty(field.LookupList))
                        {
                            if (!listIds.Contains(field.LookupList))
                            {
                                string listId = GetListId(field.LookupList);
                                listIds.Add(field.LookupList, listId);
                            }

                            schemaTextField = string.Format("<Field Type='{0}' Name='{1}' StaticName='{1}' DisplayName='{2}' List='{3}' ShowField='{4}' Mult=\"TRUE\"/>", field.FieldType, field.InternalName, field.Title, listIds[field.LookupList], field.LookupField);
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
                    case "MultiChoice":
                        schemaTextField = string.Format("<Field Type='{0}' Name='{1}' StaticName='{1}' DisplayName='{2}'><CHOICES>", field.FieldType, field.InternalName, field.Title, field.LookupList, field.LookupField);
                        for (int i = 0; i < field.Choices.Length; i++)
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
            while(files.Length == 0)
            {
                directory = directory.GetDirectories()[0];
                files = directory.GetFiles();
            }

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

        public static Microsoft.SharePoint.Client.File UploadFileSlicePerSlice(ClientContext ctx, List list, DirectoryInfo directory, Item item, int fileChunkSizeInMB = 3)
        {
            // Each sliced upload requires a unique ID.
            Guid uploadId = Guid.NewGuid();
            string file = GetItemValue(item, "FileLeafRef");
            string fileName = Path.Combine(directory.FullName, file);
            string folder = item.Folder.Replace("/OFVASS", "/es-es/businessvalue/offering");
            string folderName = folder.Replace(list.RootFolder.ServerRelativeUrl + "/", "");

            // Get the name of the file.
            string uniqueFileName = Path.GetFileName(fileName);

            // Get the folder to upload into. 
            Folder rootFolder = ctx.Web.GetFolderByServerRelativeUrl(list.RootFolder.ServerRelativeUrl);

            Console.WriteLine();
            Console.WriteLine("Creando carpeta {0}...", folder);

            CreateFolder(ctx, rootFolder, folderName);

            Folder docs = ctx.Web.GetFolderByServerRelativeUrl(folder);

            // Get the information about the folder that will hold the file.
            ctx.Load(docs);
            ctx.ExecuteQuery();

            // File object.
            Microsoft.SharePoint.Client.File uploadFile;

            // Calculate block size in bytes.
            int blockSize = fileChunkSizeInMB * 1024 * 1024;

            // Get the size of the file.
            long fileSize = new FileInfo(fileName).Length;

            Console.Write("Subiendo fichero {0} a {1}: 0 de {2}\r", file, docs.Name, BytesToSize(fileSize));

            if (fileSize <= blockSize)
            {
                // Use regular approach.
                using (FileStream fs = new FileStream(fileName, FileMode.Open))
                {
                    FileCreationInformation fileInfo = new FileCreationInformation();
                    fileInfo.ContentStream = fs;
                    fileInfo.Url = uniqueFileName;
                    fileInfo.Overwrite = true;
                    uploadFile = docs.Files.Add(fileInfo);
                    ctx.Load(uploadFile);
                    ctx.ExecuteQuery();


                    Console.Write("Subiendo fichero {0} a {1}: {2} de {2}\r", file, docs.Name, BytesToSize(fileSize));

                    FileInfo sourceFile = new FileInfo(fileName);
                    string sourceFileName = sourceFile.Name;
                    string targetPath = Path.Combine(@"C:\ImportacionLog", sourceFileName);
                    sourceFile.MoveTo(targetPath);


                    return uploadFile;
                }
            }
            else
            {
                // Use large file upload approach.
                ClientResult<long> bytesUploaded = null;

                FileStream fs = null;
                try
                {
                    fs = System.IO.File.Open(fileName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                    using (BinaryReader br = new BinaryReader(fs))
                    {
                        byte[] buffer = new byte[blockSize];
                        Byte[] lastBuffer = null;
                        long fileoffset = 0;
                        long totalBytesRead = 0;
                        int bytesRead;
                        bool first = true;
                        bool last = false;

                        // Read data from file system in blocks. 
                        while ((bytesRead = br.Read(buffer, 0, buffer.Length)) > 0)
                        {
                            long percentage = (totalBytesRead * 100) / fileSize;

                            Console.Write("Subiendo fichero {0} a {1}: {2} de {3}\r", file, docs.Name, BytesToSize(totalBytesRead), BytesToSize(fileSize));

                            totalBytesRead = totalBytesRead + bytesRead;

                            // You've reached the end of the file.
                            if (totalBytesRead == fileSize)
                            {
                                last = true;
                                // Copy to a new buffer that has the correct size.
                                lastBuffer = new byte[bytesRead];
                                Array.Copy(buffer, 0, lastBuffer, 0, bytesRead);
                            }

                            if (first)
                            {
                                using (MemoryStream contentStream = new MemoryStream())
                                {
                                    // Add an empty file.
                                    FileCreationInformation fileInfo = new FileCreationInformation();
                                    fileInfo.ContentStream = contentStream;
                                    fileInfo.Url = uniqueFileName;
                                    fileInfo.Overwrite = true;
                                    uploadFile = docs.Files.Add(fileInfo);

                                    // Start upload by uploading the first slice. 
                                    using (MemoryStream s = new MemoryStream(buffer))
                                    {
                                        // Call the start upload method on the first slice.
                                        bytesUploaded = uploadFile.StartUpload(uploadId, s);
                                        ctx.ExecuteQuery();
                                        // fileoffset is the pointer where the next slice will be added.
                                        fileoffset = bytesUploaded.Value;
                                    }

                                    // You can only start the upload once.
                                    first = false;
                                }
                            }
                            else
                            {
                                // Get a reference to your file.
                                uploadFile = ctx.Web.GetFileByServerRelativeUrl(docs.ServerRelativeUrl + System.IO.Path.AltDirectorySeparatorChar + uniqueFileName);

                                if (last)
                                {
                                    // Is this the last slice of data?
                                    using (MemoryStream s = new MemoryStream(lastBuffer))
                                    {
                                        // End sliced upload by calling FinishUpload.
                                        uploadFile = uploadFile.FinishUpload(uploadId, fileoffset, s);
                                        ctx.ExecuteQuery();

                                        // Return the file object for the uploaded file.
                                        return uploadFile;
                                    }
                                }
                                else
                                {
                                    using (MemoryStream s = new MemoryStream(buffer))
                                    {
                                        // Continue sliced upload.
                                        bytesUploaded = uploadFile.ContinueUpload(uploadId, fileoffset, s);
                                        ctx.ExecuteQuery();
                                        // Update fileoffset for the next slice.
                                        fileoffset = bytesUploaded.Value;
                                    }
                                }
                            }

                        } // while ((bytesRead = br.Read(buffer, 0, buffer.Length)) > 0)
                    }
                }
                finally
                {
                    Console.Write("Subiendo fichero {0} a {1}: {2} de {2}\r", file, docs.Name, BytesToSize(fileSize));
                    if (fs != null)
                    {
                        fs.Dispose();
                    }

                    FileInfo sourceFile = new FileInfo(fileName);
                    string sourceFileName = sourceFile.Name;
                    string targetPath = Path.Combine(@"C:\ImportacionLog", sourceFileName);
                    sourceFile.MoveTo(targetPath);
                }
            }

            return null;
        }

        private static string GetItemValue(Item item, string field)
        {
            string value = string.Empty;
            foreach(Field f in item.Fields)
            {
                if(f.InternalName == field)
                {
                    value = f.Value;
                    break;
                }
            }

            return value;
        }

        private static string BytesToSize(double bytes)
        {
            string[] sizes = new string[] { "Bytes", "KB", "MB", "GB", "TB" };

            if (bytes == 0)
                return "0 Byte";

            int i = Convert.ToInt32(Math.Floor(Math.Log(bytes) / Math.Log(1024)));

            return Math.Round(bytes / Math.Pow(1024, i), 2) + " " + sizes[i];
        }

        private static void CreateFolder(ClientContext ctx, Folder folder, string folderUrl)
        {
            if (!string.IsNullOrEmpty(folderUrl))
            {
                string[] folders = folderUrl.Split('/');

                if (folders.Length > 0)
                {
                    Folder f = folder.Folders.Add(folders[0]);
                    ctx.ExecuteQuery();

                    CreateFolder(ctx, f, string.Join("/", folders.Skip(1)));
                }
            }
            
        }
    }
}
