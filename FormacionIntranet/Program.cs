using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.Utilities;

namespace FormacionIntranet
{
    class Program
    {
        static void Main(string[] args)
        {
            CheckCourses();
        }

        static void CheckCourses()
        {
            string today = DateTime.Today.ToString("yyyy-MM-ddTHH:mm:ssZ");
            ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/formacion");
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

            CamlQuery query = new CamlQuery();

            query.ViewXml = string.Format(@"<View Scope='RecursiveAll'>
                                    <Query>
                                        <Where>
                                            <Eq>
                                                <FieldRef Name='Fecha_x0020_Fin'/>
                                                <Value IncludeTimeValue='FALSE' Type='DateTime'>{0}</Value>
                                            </Eq>
                                        </Where>
                                    </Query>
                                </View>", today);

            List list = context.Web.Lists.GetByTitle("Listado Cursos Gestión");
            ListItemCollection items = list.GetItems(query);

            context.Load(list);
            context.Load(items);

            context.ExecuteQuery();

            foreach(ListItem item in items)
            {
                SendSurvey(context, item);
            }

            Console.ReadLine();

        }

        static void SendSurvey(ClientContext context, ListItem item)
        {
            FieldUserValue user = item["Author"] as FieldUserValue;

            EmailProperties emailp = new EmailProperties();

            emailp.To = new List<string> { user.Email };
            emailp.From = "no-reply@sharepointonline.com";

            emailp.Body = string.Format("<a href='https://grupovass.sharepoint.com/es-es/formacion/Paginas/Encuesta-formacion.aspx?c={0}'>{1}</a>", item["ID"], item["Nombre_x0020_Curso"]);

            emailp.Subject = "Encuesta de formación";

            Utility.SendEmail(context, emailp);

            context.ExecuteQuery();
        }

        static SecureString GetSecureString()
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
