using System;
using System.Collections.Generic;
using System.Linq;
using System.Security;
using System.Text;
using System.Threading.Tasks;

using Microsoft.SharePoint.Client;

namespace Tools
{
    class Program
    {
        static void Main(string[] args)
        {
            ClientContext context = new ClientContext("https://grupovass.sharepoint.com/es-es/formacion");
            context.Credentials = new SharePointOnlineCredentials("intranet1@vass.es", GetSecureString());

            List list = context.Web.Lists.GetByTitle("Encuesta formación");
            Folder folder = list.RootFolder;
            View view = list.DefaultView;
            ContentTypeCollection contentTypes = list.ContentTypes;

            context.Load(list);
            context.Load(folder);
            context.Load(contentTypes);

            context.ExecuteQuery();

            list.ContentTypesEnabled = true;
            context.ExecuteQuery();

            ContentType ct = contentTypes[0];
            ct.DisplayFormUrl = "https://grupovass.sharepoint.com/es-es/formacion/Paginas/cursos.aspx";
            ct.Update(false);

            context.ExecuteQuery();

            Console.Write("Ya");
            Console.ReadLine();
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
