using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.UserProfiles;
using Microsoft.SharePoint.Client.Utilities;

namespace GamificacionIntranet
{
    class Program
    {
        static string everyoneGroup = "c:0-.f|rolemanager|spo-grid-all-users/b716c11f-16a3-4d15-8dbc-f11f7fdefe5a";
        static string adminUser = System.Configuration.ConfigurationManager.AppSettings["user"];

        static void Main(string[] args)
        {
            FileStream ostrm;
            StreamWriter writer;
            TextWriter oldOut = Console.Out;

            try
            {
                ostrm = new FileStream(string.Format("./{0}.log", DateTime.Now.ToString().Replace("/", "").Replace(":", "").Replace(" ", "")), FileMode.OpenOrCreate, FileAccess.Write);
                writer = new StreamWriter(ostrm);
            }
            catch (Exception e)
            {
                Console.WriteLine("Cannot open Redirect.txt for writing");
                Console.WriteLine(e.Message);
                return;
            }

            Console.SetOut(writer);

            CheckSurveys();
            writer.Flush();

            GetGames();
            writer.Flush();

            writer.Close();
            ostrm.Close();
        }

        #region 1. Comprobación de permisos encuestas
        
        /// <summary>
        /// Comprueba si en la encuesta asociada a un juego tienen permisos de escritura los usuarios
        /// </summary>
        static void CheckSurveys()
        {
            Console.WriteLine("{0}\tObteniendo encuestas", DateTime.Now);

            ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/businessvalue/gaming");
            context.Credentials = new SharePointOnlineCredentials(adminUser, GetSecureString());

            //Obtenemos los minijuegos (encuestas)
            CamlQuery query = new CamlQuery();
            query.ViewXml = "<View><Query><Where><IsNotNull><FieldRef Name='Juego' /></IsNotNull></Where></Query></View>";

            List list = context.Web.Lists.GetByTitle("Juegos");
            ListItemCollection items = list.GetItems(query);

            context.Load(list);
            context.Load(items);

            context.ExecuteQuery();

            foreach(ListItem item in items)
            {
                CheckSurveyPermissions(context, item["Title"].ToString());
            }
        }

        /// <summary>
        /// Comprueba los permisos para una encuesta. Si no están asignados los permisos, los asigna
        /// </summary>
        /// <param name="context"></param>
        /// <param name="surveyTitle"></param>
        static void CheckSurveyPermissions(ClientContext context, string surveyTitle)
        {
            Console.WriteLine("{0}\tComprobando permisos para {1}", DateTime.Now, surveyTitle);

            List list = context.Web.Lists.GetByTitle(surveyTitle);

            LoadHasUniqueRoleAssignments(context, list);
            context.ExecuteQuery();

            if(!list.HasUniqueRoleAssignments)
            {
                try
                {
                    Console.WriteLine("{0}\tEstableciendo permisos en la encuesta {1} para el grupo {2}", DateTime.Now, surveyTitle, everyoneGroup);

                    list.BreakRoleInheritance(true, false);

                    context.Load(list);
                    context.ExecuteQuery();

                    User allUsers = context.Web.EnsureUser(everyoneGroup);
                    context.ExecuteQuery();

                    RoleDefinition roletypes = context.Web.RoleDefinitions.GetByType(RoleType.Contributor);
                    context.ExecuteQuery();

                    RoleDefinitionBindingCollection collRoleDefinitionBinding = new RoleDefinitionBindingCollection(context);
                    collRoleDefinitionBinding.Add(roletypes);
                    list.RoleAssignments.Add(allUsers, collRoleDefinitionBinding);

                    context.ExecuteQuery();
                }
                catch(Exception ex)
                {
                    Console.WriteLine("{0}\tNo se han podido establecer los permisos en la encuesta {1}", DateTime.Now, surveyTitle);
                }
            }
            else
            {
                Console.WriteLine("{0}\tLa encuesta {1} ya tiene los permisos asignados", DateTime.Now, surveyTitle);
            }
        }

        #endregion

        #region 2. Asignación de puntos
        static void GetGames()
        {
            Console.WriteLine("{0}\tObteniendo juegos", DateTime.Now);

            ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/businessvalue/gaming");
            context.Credentials = new SharePointOnlineCredentials(adminUser, GetSecureString());

            //Obtenemos los minijuegos (encuestas)
            CamlQuery query = new CamlQuery();
            query.ViewXml = "<View><Query><Where><IsNull><FieldRef Name='Juego' /></IsNull></Where></Query></View>";

            List list = context.Web.Lists.GetByTitle("Juegos");
            ListItemCollection items = list.GetItems(query);

            context.Load(list);
            context.Load(items);

            context.ExecuteQuery();

            foreach (ListItem item in items)
            {
                SearchGames(item);
            }
        }

        static void SearchGames(ListItem game)
        {
            ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/");
            context.Credentials = new SharePointOnlineCredentials(adminUser, GetSecureString());

            WebCollection webs = context.Web.Webs;

            context.Load(webs);
            context.ExecuteQuery();

            foreach(Web web in webs)
            {
                SearchGame(context, web, game);
            }
        }

        static void SearchGame(ClientContext context, Web web, ListItem game)
        {
            WebCollection webs = web.Webs;
            context.Load(webs);
            context.ExecuteQuery();

            if(web.Webs.Count > 0)
            {
                foreach (Web subWeb in web.Webs)
                    SearchGame(context, subWeb, game);
            }

            Console.WriteLine("{0}\tBuscando juego {1} en {2}", DateTime.Now, game["Title"], web.Title);

            ListCollection lists = web.Lists;

            context.Load(lists, li => li.Include(list => list.Fields, list => list.Title));
            context.ExecuteQuery();

            foreach(List list in lists)
            {
                FieldCollection fields = list.Fields;
                foreach(Field field in fields)
                {
                    if(field.InternalName.Equals("juego", StringComparison.InvariantCultureIgnoreCase))
                    {
                        if(field.DefaultValue == game["Title"].ToString())
                        {
                            Console.WriteLine("{0}\tJuego {1} encontrado en {2}", DateTime.Now, game["Title"], list.Title);
                            CheckItems(context, list, game);
                            break;
                        }
                    }
                }
            }
        }

        static void CheckItems(ClientContext context, List list, ListItem game)
        {
            EnsureScoreField(context, list);

            ListItemCollection items = list.GetItems(CamlQuery.CreateAllItemsQuery());
            context.Load(items);
            context.ExecuteQuery();

            foreach(ListItem item in items)
            {
                Console.WriteLine("{0}\tComprobando {1} en {2}", DateTime.Now, game["Title"], item["Title"]);

                DateTime itemDate = new DateTime();
                if (item.FieldValues.ContainsKey("Fecha_x0020_de_x0020_Finalizacio"))
                    itemDate = Convert.ToDateTime(item["Fecha_x0020_de_x0020_Finalizacio"]);
                else
                    itemDate = Convert.ToDateTime(item["Created"]);

                if(DateTime.Compare(itemDate, DateTime.Now) <= 0)
                {
                    if (!Convert.ToBoolean(item["Score"]))
                    {
                        FieldUserValue userField = item["Author"] as FieldUserValue;
                        User user = context.Web.EnsureUser(userField.Email);

                        context.Load(user);
                        context.ExecuteQuery();

                        SetScore(user.LoginName, game);

                        item["Score"] = true;
                        item.SystemUpdate();

                        context.ExecuteQuery();

                        if (list.Title.Equals("Charlas", StringComparison.InvariantCultureIgnoreCase))
                            SendSurvey(item);
                    }
                }
            }
        }

        static void SetScore(string loginName, ListItem game)
        {
            Console.WriteLine("{0}\tAsignando {1} puntos a {2} por la partida {3}", DateTime.Now, game["Puntuacion"], loginName, game["Title"]);

            ClientContext adminContext = new ClientContext("https://grupovass-admin.sharepoint.com");
            adminContext.Credentials = new SharePointOnlineCredentials(adminUser, GetSecureString());

            PeopleManager peopleManager = new PeopleManager(adminContext);
            PersonProperties personProperties = peopleManager.GetPropertiesFor(loginName);

            adminContext.Load(personProperties, p => p.AccountName, p => p.UserProfileProperties);
            adminContext.ExecuteQuery();

            string userGames = personProperties.UserProfileProperties["Game"];
            string userGamesScore = personProperties.UserProfileProperties["GameScore"];

            string[] games = userGames.Split(new string[] { ";" }, StringSplitOptions.RemoveEmptyEntries);
            string[] gamesScore = userGamesScore.Split(new string[] { ";" }, StringSplitOptions.RemoveEmptyEntries);

            for(var i = 0; i < games.Length; i++)
            {
                if(games[i].Equals(game["Title"].ToString(), StringComparison.InvariantCultureIgnoreCase))
                {
                    gamesScore[i] = (Convert.ToInt32(gamesScore[i]) + Convert.ToInt32(game["Puntuacion"])).ToString();
                    break;
                }
            }

            peopleManager.SetMultiValuedProfileProperty(loginName, "GameScore", gamesScore);

            adminContext.ExecuteQuery();
        }

        static void EnsureScoreField(ClientContext context, List list)
        {
            bool hasField = false;

            FieldCollection fields = list.Fields;
            foreach (Field field in fields)
            {
                if (field.InternalName.Equals("score", StringComparison.InvariantCultureIgnoreCase))
                {
                    hasField = true;
                    break;
                }
            }

            if (!hasField)
            {
                string schemaBooleanField = "<Field Type='Boolean' Name='Score' StaticName='Score' DisplayName='Score' Hidden='TRUE' />";
                Field booleanField = list.Fields.AddFieldAsXml(schemaBooleanField, false, AddFieldOptions.AddFieldInternalNameHint);
                context.ExecuteQuery();
            }
        }

        #endregion

        #region Envío de encuestas
        static void SendSurvey(ListItem game)
        {
            ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/businessvalue");
            context.Credentials = new SharePointOnlineCredentials(adminUser, GetSecureString());

            CamlQuery q = new CamlQuery() { ViewXml = string.Format("<View><Query><Where><Eq><FieldRef Name='Charla' /><Value Type='Lookup'>{0}</Value></Eq></Where></Query></View>", game["Title"]) };

            List inscriptions = context.Web.Lists.GetByTitle("Inscripciones charlas");
            ListItemCollection items = inscriptions.GetItems(q);

            context.Load(inscriptions);
            context.Load(items);

            context.ExecuteQuery();

            foreach(ListItem item in items)
            {
                FieldUserValue userField = item["Author"] as FieldUserValue;
                SendMail(context, userField.Email, game);
            }
            
        }

        static void SendMail(ClientContext context, string to, ListItem game)
        {
            Console.WriteLine("{0}\tEnviando encuesta a {1} por inscripción en charla {2}", DateTime.Now, to, game["Title"]);

            string url = string.Format("https://grupovass.sharepoint.com/es-es/businessvalue/gaming/Paginas/valorar-partida.aspx?s=/es-es/businessvalue&n=Charlas&c={0}", game["ID"]);

            string body = string.Format(@"<p>La charla ya ha finalizado, solo falta un último paso, ¡queremos saber tu satisfacción sobre la misma!</p>
                                    <p>Por favor completa la siguiente <a href='{0}'>encuesta</a>.</p>
                                    <p>¡Muchas gracias, hasta la próxima!</p>", url);

            EmailProperties emailp = new EmailProperties();

            emailp.To = new List<string> { to };
            emailp.From = "no-reply@sharepointonline.com";

            emailp.Body = body;

            emailp.Subject = string.Format("Encuesta {0}", game["Title"]);

            Utility.SendEmail(context, emailp);

            context.ExecuteQuery();
        }
        #endregion

        static void LoadHasUniqueRoleAssignments(ClientContext context, SecurableObject securableObject)
        {
            context.Load(securableObject, o => o.HasUniqueRoleAssignments);
        }

        static SecureString GetSecureString()
        {
            string pwd = System.Configuration.ConfigurationManager.AppSettings["pwd"];
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
