using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;
using Microsoft.SharePoint.Client;
using Newtonsoft.Json.Linq;

namespace AjustesOffering
{

    public struct Item
    {
        public string CodigoComercial;
        public string CodigoOferta;
        public string AnioOferta;
        public int TargetLookupId;
    }

    public struct Responsable
    {
        public int UserId;
        public string User;
        public string FileLeafRef;
        public string CodigoOferta;
        public string AnioOferta;
    }

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

    public struct FileItem
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
        private static Hashtable lookupsTable = new Hashtable();
        private static Hashtable errores = new Hashtable();

        static void Main(string[] args)
        {
            //Responsables();
            //Comerciales();
            //ResponsablesOfertas();
            //UpdateList();

            //Lookups("Ofertas");
            //Lookups("Biblioteca Referencias ES");
            //Lookups("Biblioteca Referencias EN");
        }

        #region Comerciales
        private static void Comerciales()
        {
            GetItems();
        }

        private static void GetItems()
        {
            Console.WriteLine("Contectando...");
            ClientContext context = new ClientContext("http://vassvm-08096/OFVASS");
            context.Credentials = new System.Net.NetworkCredential("vassdesk\\intranet1", "Lunes.123");

            List list = context.Web.Lists.GetByTitle("Ofertas");

            CamlQuery query = new CamlQuery();
            query = CamlQuery.CreateAllItemsQuery();

            ListItemCollection items = list.GetItems(query);

            context.Load(list);
            context.Load(items, i => i.Include(
                item => item["C_x00d3_DIGO"],
                item => item["Comercial_x003a_Codigo_x0020_Com"],
                item => item["A_x00d1_O"]));

            //A_x00d1_O
            context.Load(list.Fields);
            context.ExecuteQuery();

            List<Item> exportItems = new List<Item>();

            int itemCount = items.Count;
            int counter = 0;

            foreach (ListItem listItem in items)
            {
                if(listItem["Comercial_x003a_Codigo_x0020_Com"] != null)
                {
                    FieldLookupValue lookup = listItem["Comercial_x003a_Codigo_x0020_Com"] as FieldLookupValue;

                    if (lookup.LookupValue != null)
                    {
                        Item currentItem = new Item();
                        currentItem.CodigoComercial = lookup.LookupValue.ToString();
                        currentItem.AnioOferta = listItem["A_x00d1_O"].ToString();
                        currentItem.CodigoOferta = listItem["C_x00d3_DIGO"].ToString();

                        exportItems.Add(currentItem);
                    }
                }

                counter++;

                int percentage = (counter * 100) / itemCount;
                Console.Write("Obteniendo elmentos...{0}%\r", percentage);

                if (percentage == 100)
                    Console.WriteLine();
            }

            GetLookupsId(exportItems);
        }

        private static void GetLookupsId(List<Item> exportItems)
        {
            Console.WriteLine("Conectando a https://grupovass.sharepoint.com/es-es/businessvalue/offering...");

            ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/businessvalue/offering");
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());
            List list = context.Web.Lists.GetByTitle("Codigos Comercial VASS");

            int counter = 0;

            List<Item> exportItemsComplete = new List<Item>();

            foreach (Item exportItem in exportItems)
            {
                CamlQuery query = new CamlQuery();
                query.ViewXml = string.Format(@"<View>
                                    <Query>
                                        <Where>
                                            <Eq>
                                                <FieldRef Name='Codigo_x0020_Comercial'/>
                                                <Value Type='Text'>{0}</Value>
                                            </Eq>
                                        </Where>
                                    </Query>
                                </View>", exportItem.CodigoComercial);

                ListItemCollection items = list.GetItems(query);

                context.Load(items);
                context.ExecuteQuery();

                if(items.Count == 1)
                {
                    Item newItem = exportItem;
                    newItem.TargetLookupId = Convert.ToInt32(items[0]["ID"]);
                    exportItemsComplete.Add(newItem);
                }

                counter++;

                int percentage = (counter * 100) / exportItems.Count;
                Console.Write("Obteniendo códigos comerciales...{0}%\r", percentage);
            }

            UpdateItems(exportItemsComplete);
        }

        private static void UpdateItems(List<Item> exportItems)
        {
            ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/businessvalue/offering");
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());
            List list = context.Web.Lists.GetByTitle("Ofertas");

            int counter = 0;

            foreach (Item exportItem in exportItems)
            {
                CamlQuery query = new CamlQuery();
                query.ViewXml = string.Format(@"<View>
                                    <Query>
                                        <Where>
                                            <And>
                                                <Eq>
                                                    <FieldRef Name='C_x00d3_DIGO'/>
                                                    <Value Type='Text'>{0}</Value>
                                                </Eq>
                                                <Eq>
                                                    <FieldRef Name='A_x00d1_O'/>
                                                    <Value Type='Text'>{1}</Value>
                                                </Eq>
                                            </And>
                                        </Where>
                                    </Query>
                                </View>", exportItem.CodigoOferta, exportItem.AnioOferta);

                ListItemCollection items = list.GetItems(query);

                context.Load(items);
                context.ExecuteQuery();

                if (items.Count == 1)
                {
                    ListItem item = items[0];
                    FieldLookupValue lv = new FieldLookupValue();
                    lv.LookupId = exportItem.TargetLookupId;

                    item["Comercial"] = lv;
                    item.Update();
                    context.ExecuteQuery();
                }

                counter++;

                int percentage = (counter * 100) / exportItems.Count;
                Console.Write("Actualizando elementos...{0}%\r", percentage);
            }            
        }

        #endregion

        #region Responsables
        private static void Responsables()
        {
            try
            {
                GetItems("Biblioteca Referencias ES");
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            Console.ReadLine();
        }

        private static void GetItems(string listTitle)
        {
            Console.WriteLine("Contectando...");
            ClientContext context = new ClientContext("http://vassvm-08096/OFVASS");
            context.Credentials = new System.Net.NetworkCredential("vassdesk\\intranet1", "Lunes.123");
            Web web = context.Web;
            List list = web.Lists.GetByTitle(listTitle);

            CamlQuery query = new CamlQuery();
            query = CamlQuery.CreateAllItemsQuery();

            ListItemCollection items = list.GetItems(query);

            context.Load(web);
            context.Load(list);
            context.Load(items, i => i.Include(
                item => item["Responsable"],
                item => item["FileLeafRef"]));

            //A_x00d1_O
            context.Load(list.Fields);
            context.ExecuteQuery();

            List<Responsable> exportItems = new List<Responsable>();

            int itemCount = items.Count;
            int counter = 0;

            foreach (ListItem listItem in items)
            {
                if (listItem["Responsable"] != null)
                {
                    FieldUserValue userValue = listItem["Responsable"] as FieldUserValue;

                    Responsable rp = new Responsable();
                    rp.UserId = userValue.LookupId;
                    rp.User = userValue.LookupValue;
                    rp.FileLeafRef = listItem["FileLeafRef"].ToString();

                    exportItems.Add(rp);
                }

                counter++;

                int percentage = (counter * 100) / itemCount;
                Console.Write("Obteniendo elmentos...{0}%\r", percentage);

                if (percentage == 100)
                    Console.WriteLine();
            }

            GetLookupValues(exportItems);
        }

        private static void GetLookupValues(List<Responsable> responsables)
        {
            ClientContext context = new ClientContext("http://vassvm-08096/OFVASS");
            context.Credentials = new System.Net.NetworkCredential("vassdesk\\intranet1", "Lunes.123");
            List list = context.Web.SiteUserInfoList;

            CamlQuery query = new CamlQuery();
            query = CamlQuery.CreateAllItemsQuery();

            ListItemCollection items = list.GetItems(query);

            context.Load(items, i => i.Include(
                item => item["ID"],
                item => item["EMail"]));

            context.ExecuteQuery();

            List<Responsable> responsablesCompleto = new List<Responsable>();

            int counter = 0;
            int itemCount = responsables.Count;

            foreach (Responsable rp in responsables)
            {
                Responsable newRp = rp;
                foreach (ListItem item in items)
                {
                    if (rp.UserId == Convert.ToInt32(item["ID"]) && item["EMail"] != null)
                    {
                        newRp.User = item["EMail"].ToString();
                        break;
                    }
                }

                responsablesCompleto.Add(newRp);

                counter++;

                int percentage = (counter * 100) / itemCount;
                Console.Write("Obteniendo direcciones de correo de los usuarios...{0}%\r", percentage);

                if (percentage == 100)
                    Console.WriteLine();
            }

            UpdateItems(responsablesCompleto);
        }

        private static void UpdateItems(List<Responsable> responsables)
        {
            ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/businessvalue/offering");
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

            int counter = 0;
            int itemCount = responsables.Count;

            foreach(Responsable rp in responsables)
            {
                try
                {
                    //Obtenemos el usuario
                    var result = Microsoft.SharePoint.Client.Utilities.Utility.ResolvePrincipal(context, context.Web, rp.User, Microsoft.SharePoint.Client.Utilities.PrincipalType.User, Microsoft.SharePoint.Client.Utilities.PrincipalSource.All, null, true);
                    context.ExecuteQuery();

                    if (result != null)
                    {
                        User user = context.Web.EnsureUser(result.Value.LoginName);
                        context.Load(user);
                        context.ExecuteQuery();

                        try
                        {
                            //Obtenemos el fichero
                            var fileUrl = "/es-es/businessvalue/offering/Bliblioteca Referencias ES/" + rp.FileLeafRef;
                            Microsoft.SharePoint.Client.File file = context.Web.GetFileByServerRelativeUrl(fileUrl);
                            var fileItem = file.ListItemAllFields;

                            context.Load(file);
                            context.Load(fileItem);
                            context.ExecuteQuery();

                            if (fileItem != null)
                            {
                                FieldUserValue uv = new FieldUserValue();
                                uv.LookupId = user.Id;

                                fileItem["Responsable"] = uv;
                                fileItem.Update();
                                context.ExecuteQuery();
                            }
                        }
                        catch(Exception ex)
                        {

                        }
                        
                    }
                }
                catch(Exception ex)
                {
                    //Obtenemos el fichero
                    var fileUrl = "/es-es/businessvalue/offering/Bliblioteca Referencias ES/" + rp.FileLeafRef;
                    Microsoft.SharePoint.Client.File file = context.Web.GetFileByServerRelativeUrl(fileUrl);
                    var fileItem = file.ListItemAllFields;

                    context.Load(file);
                    context.Load(fileItem);
                    context.ExecuteQuery();

                    if (fileItem != null)
                    {
                        fileItem["ResponsableTexto"] = rp.User;
                        fileItem.Update();
                        context.ExecuteQuery();
                    }
                }
                

                counter++;

                int percentage = (counter * 100) / itemCount;
                Console.Write("Actualizando ficheros...{0}%\r", percentage);

                if (percentage == 100)
                    Console.WriteLine();
            }
            
        }

        private static Responsable? FindUser(List<Responsable> responsables, string userName)
        {
            foreach(Responsable rp in responsables)
            {
                if (String.Compare(rp.User, userName, new CultureInfo("es-ES"), CompareOptions.IgnoreNonSpace | CompareOptions.IgnoreCase) == 0)
                {
                    return rp;
                }
            }

            return null;
        }
        #endregion

        #region Responsables Ofertas
        private static void ResponsablesOfertas()
        {
            try
            {
                GetItems2("Ofertas");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            Console.ReadLine();
        }

        private static void GetItems2(string listTitle)
        {
            Console.WriteLine("Contectando...");
            ClientContext context = new ClientContext("http://vassvm-08096/OFVASS");
            context.Credentials = new System.Net.NetworkCredential("vassdesk\\intranet1", "Lunes.123");
            Web web = context.Web;
            List list = web.Lists.GetByTitle(listTitle);

            CamlQuery query = new CamlQuery();
            query = CamlQuery.CreateAllItemsQuery();

            ListItemCollection items = list.GetItems(query);

            context.Load(web);
            context.Load(list);
            context.Load(items, i => i.Include(
                item => item["Responsable"],
                item => item["C_x00d3_DIGO"],
                item => item["A_x00d1_O"]));

            context.ExecuteQuery();

            List<Responsable> exportItems = new List<Responsable>();

            int itemCount = items.Count;
            int counter = 0;

            foreach (ListItem listItem in items)
            {
                if (listItem["Responsable"] != null)
                {
                    if(listItem["C_x00d3_DIGO"] != null) {
                        FieldUserValue userValue = listItem["Responsable"] as FieldUserValue;

                        Responsable rp = new Responsable();
                        rp.UserId = userValue.LookupId;
                        rp.User = userValue.LookupValue;
                        rp.AnioOferta = listItem["A_x00d1_O"].ToString();
                        rp.CodigoOferta = listItem["C_x00d3_DIGO"].ToString();

                        exportItems.Add(rp);
                    }
                    
                }

                counter++;

                int percentage = (counter * 100) / itemCount;
                Console.Write("Obteniendo elmentos...{0}%\r", percentage);

                if (percentage == 100)
                    Console.WriteLine();
            }

            GetLookupValues2(exportItems);
        }

        private static void GetLookupValues2(List<Responsable> responsables)
        {
            ClientContext context = new ClientContext("http://vassvm-08096/OFVASS");
            context.Credentials = new System.Net.NetworkCredential("vassdesk\\intranet1", "Lunes.123");
            List list = context.Web.SiteUserInfoList;

            CamlQuery query = new CamlQuery();
            query = CamlQuery.CreateAllItemsQuery();

            ListItemCollection items = list.GetItems(query);

            context.Load(items, i => i.Include(
                item => item["ID"],
                item => item["EMail"]));

            context.ExecuteQuery();

            List<Responsable> responsablesCompleto = new List<Responsable>();

            int counter = 0;
            int itemCount = responsables.Count;

            foreach (Responsable rp in responsables)
            {
                Responsable newRp = rp;
                foreach (ListItem item in items)
                {
                    if (rp.UserId == Convert.ToInt32(item["ID"]) && item["EMail"] != null)
                    {
                        newRp.User = item["EMail"].ToString();
                        break;
                    }
                }

                responsablesCompleto.Add(newRp);

                counter++;

                int percentage = (counter * 100) / itemCount;
                Console.Write("Obteniendo direcciones de correo de los usuarios...{0}%\r", percentage);

                if (percentage == 100)
                    Console.WriteLine();
            }

            

            UpdateItems2(responsablesCompleto);
        }

        private static void UpdateItems2(List<Responsable> responsables)
        {
            ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/businessvalue/offering");
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

            int counter = 0;
            int itemCount = responsables.Count;

            foreach (Responsable rp in responsables)
            {
                try
                {
                    //Obtenemos el usuario
                    var result = Microsoft.SharePoint.Client.Utilities.Utility.ResolvePrincipal(context, context.Web, rp.User, Microsoft.SharePoint.Client.Utilities.PrincipalType.User, Microsoft.SharePoint.Client.Utilities.PrincipalSource.All, null, true);
                    context.ExecuteQuery();

                    if (result != null)
                    {
                        User user = context.Web.EnsureUser(result.Value.LoginName);
                        context.Load(user);
                        context.ExecuteQuery();

                        List list = context.Web.Lists.GetByTitle("Ofertas");

                        CamlQuery query = new CamlQuery();
                        query.ViewXml = string.Format(@"<View>
                                    <Query>
                                        <Where>
                                            <And>
                                                <Eq>
                                                    <FieldRef Name='C_x00d3_DIGO'/>
                                                    <Value Type='Text'>{0}</Value>
                                                </Eq>
                                                <Eq>
                                                    <FieldRef Name='A_x00d1_O'/>
                                                    <Value Type='Text'>{1}</Value>
                                                </Eq>
                                            </And>
                                        </Where>
                                    </Query>
                                </View>", rp.CodigoOferta, rp.AnioOferta);

                        ListItemCollection items = list.GetItems(query);

                        context.Load(items);
                        context.ExecuteQuery();

                        if (items.Count == 1)
                        {
                            ListItem item = items[0];

                            FieldUserValue uv = new FieldUserValue();
                            uv.LookupId = user.Id;

                            item["Responsable"] = uv;
                            item.Update();
                            context.ExecuteQuery();
                        }
                    }
                }
                catch (Exception ex)
                {
                    List list = context.Web.Lists.GetByTitle("Ofertas");

                    CamlQuery query = new CamlQuery();
                    query.ViewXml = string.Format(@"<View>
                                    <Query>
                                        <Where>
                                            <And>
                                                <Eq>
                                                    <FieldRef Name='C_x00d3_DIGO'/>
                                                    <Value Type='Text'>{0}</Value>
                                                </Eq>
                                                <Eq>
                                                    <FieldRef Name='A_x00d1_O'/>
                                                    <Value Type='Text'>{1}</Value>
                                                </Eq>
                                            </And>
                                        </Where>
                                    </Query>
                                </View>", rp.CodigoOferta, rp.AnioOferta);

                    ListItemCollection items = list.GetItems(query);

                    context.Load(items);
                    context.ExecuteQuery();

                    if (items.Count == 1)
                    {
                        ListItem item = items[0];
                        
                        item["ResponsableTexto"] = rp.User;
                        item.Update();
                        context.ExecuteQuery();
                    }
                }


                counter++;

                int percentage = (counter * 100) / itemCount;
                Console.Write("Actualizando ficheros...{0}%\r", percentage);

                if (percentage == 100)
                    Console.WriteLine();
            }

        }
        #endregion

        #region Propiedades elementos
        private static void UpdateList()
        {
            try
            {
                string fileName = @"C:\ReferenciasES\Biblioteca Referencias ES\Biblioteca Referencias ES.xml";
                List<FileItem> fileItems = new List<FileItem>();

                System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(typeof(List<FileItem>));
                using (StreamReader sr = new StreamReader(fileName))
                {
                    fileItems.AddRange(serializer.Deserialize(sr) as List<FileItem>);
                }

                int counter = 0;
                int length = fileItems.Count;
                int percentage = 0;

                Console.WriteLine("Elementos a cargar {0}", length);
                Console.WriteLine("Obteniendo elementos de la lista...");

                ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/businessvalue/offering");
                context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

                CamlQuery query = CamlQuery.CreateAllItemsQuery();

                List list = context.Web.Lists.GetByTitle("Biblioteca Referencias ES");
                ListItemCollection items = list.GetItems(query);
                Folder rootFolder = list.RootFolder;
                FieldCollection listFields = list.Fields;

                context.Load(list);
                context.Load(items);
                context.Load(rootFolder);
                context.Load(listFields, fields => fields.Include(field => field.Title, field => field.InternalName));
                context.ExecuteQuery();

                foreach (ListItem listItem in items)
                {
                    //Obtenemos el elemento
                    FileItem? fileItem = GetFileItem(fileItems, listItem["FileLeafRef"].ToString());

                    try
                    {
                        if (fileItem != null)
                        {
                            foreach (Field field in fileItem.Value.Fields)
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
                                                        FieldLookupValue lv = GetLookupValue(context, field.LookupList, field.LookupField, field.Value);
                                                        if (lv != null)
                                                            listItem[targetField.InternalName] = lv;
                                                        break;
                                                    case "LookupMulti":
                                                        string[] values = field.Value.Split(new string[] { ";#" }, StringSplitOptions.RemoveEmptyEntries);

                                                        List<FieldLookupValue> lookupValues = new List<FieldLookupValue>();

                                                        for (int i = 0; i < values.Length; i++)
                                                        {
                                                            FieldLookupValue lvMulti = GetLookupValue(context, field.LookupList, field.LookupField, values[i]);
                                                            if (lvMulti != null)
                                                            {
                                                                lookupValues.Add(lvMulti);
                                                            }
                                                        }

                                                        listItem[targetField.InternalName] = (FieldLookupValue[])lookupValues.ToArray();

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
                        }
                    }
                    catch(Exception ex)
                    {
                        string file = GetItemValue(fileItem.Value, "FileLeafRef");
                        errores.Add(file, ex.ToString());
                    }
                    

                    counter++;
                    percentage = (counter * 100) / length;
                    Console.Write("Actualizando elementos en {0}...{1}%\r", list.Title, percentage);
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                Console.ReadLine();
            }
        }

        private static FileItem? GetFileItem(List<FileItem> fileItems, string fileLeafRef)
        {
            foreach(FileItem fileItem in fileItems)
            {
                foreach (Field f in fileItem.Fields)
                {
                    if (f.InternalName == "FileLeafRef")
                    {
                        if (f.Value == fileLeafRef)
                            return fileItem;
                    }
                }
            }

            return null;
        }
        #endregion

        #region Lookups
        private static void Lookups(string listTitle)
        {
            ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/businessvalue/offering");
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

            LoadLookupValues(context, "Cliente", "Title");
            LoadLookupValues(context, "Area de Negocio", "Title");
            LoadLookupValues(context, "Area Tecnica", "Title");
            LoadLookupValues(context, "Sector", "Title");
            LoadLookupValues(context, "Tecnologias", "Title");

            CamlQuery query = CamlQuery.CreateAllItemsQuery();

            List list = context.Web.Lists.GetByTitle(listTitle);
            ListItemCollection items = list.GetItems(query);
            FieldCollection fields = list.Fields;

            context.Load(list);
            context.Load(items);
            context.Load(fields);
            context.ExecuteQuery();

            string clienteLookupField = "ClienteLookup";
            string areaTecnicaLookupField = "AreaTecnicaLookup";
            string areaNegocioLookupField = "AreaNegocioLookup";
            string sectorLookupField = "SectorLookup";
            string tecnologiaLookupField = "TecnologiaLookup";

            int counter = 0;
            int itemCount = items.Count;

            foreach (ListItem item in items)
            {

                if (ContainsField(fields, "Cliente") && item["Cliente"] != null)
                {
                    string cliente = item["Cliente"].ToString();

                    if (!string.IsNullOrEmpty(cliente))
                    {
                        FieldLookupValue lvCliente = GetLookupValue(context, "Cliente", "Title", cliente);
                        if (lvCliente != null)
                            item[clienteLookupField] = lvCliente;
                    }
                }
                    
                if (ContainsField(fields, "Sector") && item["Sector"] != null)
                {
                    string sector = item["Sector"].ToString();

                    if (!string.IsNullOrEmpty(sector))
                    {
                        FieldLookupValue lvSector = GetLookupValue(context, "Sector", "Title", sector);
                        if (lvSector != null)
                            item[sectorLookupField] = lvSector;
                    }
                }

                if (ContainsField(fields, "Area_x0020_Negocio"))
                {
                    if(item["Area_x0020_Negocio"] != null)
                    {
                        string[] areaNegocio = (string[])item["Area_x0020_Negocio"];

                        List<FieldLookupValue> mlvNegocio = new List<FieldLookupValue>();
                        foreach (string area in areaNegocio)
                        {
                            FieldLookupValue lvMulti = GetLookupValue(context, "Area de Negocio", "Title", area);
                            if (lvMulti != null)
                                mlvNegocio.Add(lvMulti);
                        }

                        item[areaNegocioLookupField] = (FieldLookupValue[])mlvNegocio.ToArray();
                    }
                    
                }

                if (ContainsField(fields, "Area_x0020_Tecnica"))
                {
                    if(item["Area_x0020_Tecnica"] != null)
                    {
                        string[] areaTecnica = (string[])item["Area_x0020_Tecnica"];

                        if (areaTecnica != null)
                        {
                            List<FieldLookupValue> mlvAreaTecnica = new List<FieldLookupValue>();
                            foreach (string area in areaTecnica)
                            {
                                FieldLookupValue lvMulti = GetLookupValue(context, "Area Tecnica", "Title", area);
                                if (lvMulti != null)
                                    mlvAreaTecnica.Add(lvMulti);
                            }

                            item[areaTecnicaLookupField] = (FieldLookupValue[])mlvAreaTecnica.ToArray();
                        }
                    }
                }

                if(ContainsField(fields, "Tecnolog_x00ed_a"))
                {
                    string[] tecnologia = (string[])item["Tecnolog_x00ed_a"];

                    if (tecnologia != null)
                    {
                        List<FieldLookupValue> mlvTecnologia = new List<FieldLookupValue>();
                        foreach (string tec in tecnologia)
                        {
                            FieldLookupValue lvMulti = GetLookupValue(context, "Area Tecnica", "Title", tec);
                            if (lvMulti != null)
                                mlvTecnologia.Add(lvMulti);
                        }

                        item[tecnologiaLookupField] = (FieldLookupValue[])mlvTecnologia.ToArray();
                    }
                }


                item.Update();
                context.ExecuteQuery();

                counter++;

                int percentage = (counter * 100) / itemCount;
                Console.Write("Actualizando elementos...{0}%\r", percentage);

                if (percentage == 100)
                    Console.WriteLine();
            }
        }
        #endregion

        private static bool ContainsField(FieldCollection fields, string fieldName)
        {
            foreach(Microsoft.SharePoint.Client.Field field in fields)
            {
                if(field.InternalName == fieldName)
                {
                    return true;
                }
            }

            return false;
        }

        private static void LoadLookupValues(ClientContext clientContext, string listTitle, string fieldName)
        {
            if (!lookupsTable.ContainsKey(listTitle))
            {
                List list = clientContext.Web.Lists.GetByTitle(listTitle);
                CamlQuery camlQueryForItem = new CamlQuery();
                camlQueryForItem = CamlQuery.CreateAllItemsQuery();

                ListItemCollection listItems = list.GetItems(camlQueryForItem);
                clientContext.Load(listItems);
                clientContext.ExecuteQuery();

                Dictionary<int, string> items = new Dictionary<int, string>();

                int counter = 0;
                int itemCount = listItems.Count;

                foreach (ListItem item in listItems)
                {

                    int id = Convert.ToInt32(item["ID"]);
                    string title = item[fieldName].ToString();

                    if (!items.ContainsKey(id))
                    {
                        items.Add(id, title);
                    }

                    counter++;

                    int percentage = (counter * 100) / itemCount;
                    Console.Write("Obteniendo elementos de {0}...{1}%\r", listTitle, percentage);

                    if (percentage == 100)
                        Console.WriteLine();
                }

                lookupsTable.Add(listTitle, items);
            }
        }

        private static FieldLookupValue GetLookupValue(ClientContext clientContext, string listTitle, string fieldName, string fieldValue)
        {
            if (!lookupsTable.ContainsKey(listTitle))
            {
                List list = clientContext.Web.Lists.GetByTitle(listTitle);
                FieldCollection fields = list.Fields;
                CamlQuery camlQueryForItem = new CamlQuery();
                camlQueryForItem = CamlQuery.CreateAllItemsQuery();

                ListItemCollection listItems = list.GetItems(camlQueryForItem);
                clientContext.Load(listItems);
                clientContext.ExecuteQuery();

                Dictionary<int, string> items = new Dictionary<int, string>();

                foreach (ListItem item in listItems)
                {

                    int id = Convert.ToInt32(item["ID"]);
                    string title = item[fieldName].ToString();

                    if (!items.ContainsKey(id))
                    {
                        items.Add(id, title);
                    }
                }

                lookupsTable.Add(listTitle, items);
            }


            Dictionary<int, string> lookupItems = (Dictionary<int, string>)lookupsTable[listTitle];

            foreach (KeyValuePair<int, string> de in lookupItems)
            {
                if (String.Compare(de.Value.ToString(), fieldValue, new CultureInfo("es-ES"), CompareOptions.IgnoreNonSpace | CompareOptions.IgnoreCase) == 0)
                {
                    FieldLookupValue lv = new FieldLookupValue();
                    lv.LookupId = Convert.ToInt32(de.Key);

                    return lv;
                }
            }
            return null;
        }

        private static string GetItemValue(FileItem item, string field)
        {
            string value = string.Empty;
            foreach (Field f in item.Fields)
            {
                if (f.InternalName == field)
                {
                    value = f.Value;
                    break;
                }
            }

            return value;
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
    }
}
