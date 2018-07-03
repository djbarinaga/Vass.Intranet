using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;
using Newtonsoft.Json.Linq;

namespace AjustesOffering
{
    class Program
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

        static void Main(string[] args)
        {
            //Comerciales();
            ResponsablesOfertas();
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
                GetItems("Ofertas");
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
            }

            counter++;

            int percentage = (counter * 100) / itemCount;
            Console.Write("Obteniendo direcciones de correo de los usuarios...{0}%\r", percentage);

            if (percentage == 100)
                Console.WriteLine();

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

                        //Obtenemos el fichero
                        var fileUrl = "/es-es/businessvalue/offering/Biblioteca Referencias EN/" + rp.FileLeafRef;
                        File file = context.Web.GetFileByServerRelativeUrl(fileUrl);
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
                }
                catch(Exception ex)
                {
                    //Obtenemos el fichero
                    var fileUrl = "/es-es/businessvalue/offering/Biblioteca Referencias ES/" + rp.FileLeafRef;
                    File file = context.Web.GetFileByServerRelativeUrl(fileUrl);
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
