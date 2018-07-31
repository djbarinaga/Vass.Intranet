using System;
using System.Windows;
using System.Collections.Generic;
using System.IO;
using System.Windows.Forms;
using System.Security;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.UserProfiles;
using System.Linq;
using System.Diagnostics;
using Microsoft.VisualBasic;

namespace Nominas
{
    public partial class Form1 : System.Windows.Forms.Form
    {
        /// <summary>
        /// Inicializa el formulario principal
        /// </summary>
        public Form1()
        {
            InitializeComponent();
        }
        /// <summary>
        /// Ejecuta todo el código al cargar por primera vez el formulario
        /// </summary>
        private void Form1_Load(object sender, EventArgs e)
        {
            logPath = "C:\\Vass Nominas Logs";
            if (!Directory.Exists(logPath))
            {
                Directory.CreateDirectory(logPath);
            }
            //Damos formato a la fecha del Log
            logPath = logPath + "\\Log_VassNominas_" + DateTime.Now.ToString("ddMMyyyyHHmmss") + ".txt";
            //System.IO.File.Create(logPath);
            WriteToLog("Inicio", true);
            //Los componentes se cargan sin estar habilitados en un principio
            //Solamente aparecen habilitados dos componentes, el TextBox de usuario y el botón de conectar
            ManageControls(false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false);
            this.imgDL.Visible = false;
            this.imgFecha.Visible = true;
            this.imgSB.Visible = false;
            this.imgDocType.Visible = false;
            this.timer1.Enabled = true;
            this.label16.Visible = false;
            this.rdbNom.Checked = true;
            pictureBox1.ImageLocation = "Images\\vass.png";
        }
        string logPath;

        /// <summary>
        /// Este método establece una conexión con SharePoint Online mediante los datos pasados por el usuario
        /// </summary>
        public void ConnectToSPO()
        {
            WriteToLog("Conectando al sitio SharePoint");
            //Tomamos los datos pasados por el usuario
            string spoUser = this.txbUserName.Text;
            string spoPass = this.txbPass.Text;
            SecureString password = FetchPassword(spoPass);
            string spoSite = this.txbSPSite.Text;
            WriteToLog("Sitio: "+spoSite);
            //Conectamos al sitio de SharePoint Online con los datos que tenemos
            try
            {
                using (var context = new ClientContext(spoSite))
                {
                    //Creamos las credenciales de SharePoint para conectarnos al sitio web pasado
                    context.Credentials = new SharePointOnlineCredentials(spoUser, password);
                    Web web = context.Web;
                    
                    //Confirmamos la conexión y tratamos los controles
                    context.ExecuteQuery();
                    ManageControls(false, false, false, false, true, true, true, true, true, true, false, true,true,true,true,true);
                    this.lblStatus.ForeColor = System.Drawing.Color.Green;
                    this.lblStatus.Text = "Estado: Conectado";
                    this.imgFecha.Visible = true;
                    this.imgDocType.Visible = true;
                }
            }
            catch (Exception ex)
            {
                if (ex is System.ArgumentException)
                {
                    WriteToLog("Error al conectarse al sitio SharePoint especificado: El sitio especificado, el usuario o la contraseña, no son correctos.");
                    MessageBox.Show("Error al conectarse al sitio SharePoint especificado: El sitio especificado, el usuario o la contraseña, no son correctos.", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    //Limpiamos los TextBox
                    this.txbUserName.Text = "";
                    this.txbPass.Text = "";
                    ManageControls(false,true, true, true, false, false, false, false, false, false, false, false,false,false,false,false);
                }
                else if (ex is System.ArgumentNullException)
                {
                   WriteToLog("Error al conectarse al sitio SharePoint especificado: No pueden haber campos en blanco, faltan datos por introducir.");
                   MessageBox.Show("Error al conectarse al sitio SharePoint especificado: No pueden haber campos en blanco, faltan datos por introducir.", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    //Limpiamos los TextBox
                    this.txbUserName.Text = "";
                    this.txbPass.Text = "";
                    ManageControls(false, true, true, true, false, false, false, false, false, false, false, false,false,false,false,false);
                }
                else if (ex is Microsoft.SharePoint.Client.IdcrlException)
                {
                    WriteToLog("Error al conectarse al sitio SharePoint especificado: El Usuario o la Contraseña no son correctos.");
                    MessageBox.Show("Error al conectarse al sitio SharePoint especificado: El Usuario o la Contraseña no son correctos.", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    //Limpiamos los TextBox
                    this.txbUserName.Text = "";
                    this.txbPass.Text = "";
                    ManageControls(false, true, true, true, false, false, false, false, false, false, false, false,false,false,false,false);
                }
                else
                {
                    WriteToLog("Excepción no controlada, Error al conectarse al sitio SharePoint especificado: " + ex);
                    //Mostramos un mensaje por pantalla
                    MessageBox.Show("Error al conectarse al sitio SharePoint especificado: " + ex, "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    //Limpiamos los TextBox
                    this.txbUserName.Text = "";
                    this.txbPass.Text = "";
                    ManageControls(false, true, true, true, false, false, false, false, false, false, false, false,false,false,false,false);
                }
            }
        }
        /// <summary>
        /// Este método convierte la contraseña en una contraseña segura
        /// </summary>
        /// <param name="password">Contraseña del usuario para conectarse a SharePoint Online y Office365</param>
        private static SecureString FetchPassword(string password)
        {
            var secure = new SecureString();
            foreach (char c in password)
            {
                secure.AppendChar(c);
            }
            return secure;
        }
        /// <summary>
        /// Este método ejecuta todo el código de conexión a SharePoint Online al pulsar el botón : Conectar
        /// </summary>
        private void btnConnect_Click(object sender, EventArgs e)
        {
            //Conectamos al sitio con las credenciales pasadas
            
            ConnectToSPO();
        }
        /// <summary>
        /// Este método desconecta al usuario de SharePoint Online
        /// </summary>
        private void btnDisconnect_Click(object sender, EventArgs e)
        {
            ClearForm();
        }
        /// <summary>
        /// Este método hace que al pulsar sobre el botón de "Browse" carge los directorios locales de C:
        /// Al seleccionar uno se mostrará en el TextBox y lo almacenará para su posterior uso
        /// </summary>
        /// 
        private void browse_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog folderDlg = new FolderBrowserDialog();
            FileSystemWatcher fsWatcher = new FileSystemWatcher();
            folderDlg.ShowNewFolderButton = true;

            DialogResult result = folderDlg.ShowDialog();
            if (result == DialogResult.OK)
            {
                txbLocalDirectory.Text = folderDlg.SelectedPath;
                string [] dirs = System.IO.Directory.GetDirectories(folderDlg.SelectedPath);
                string[] files = System.IO.Directory.GetFiles(folderDlg.SelectedPath);
                if (dirs.Length == 0 && files.Length == 0)
                {
                    MessageBox.Show("la carpeta especificada está vacia ","GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    this.txbLocalDirectory.Text = "";
                    this.imgDL.Visible = false;
                }
                Environment.SpecialFolder root = folderDlg.RootFolder;
            }
        }
        /// <summary>
        /// Este método compueba si la libreria existe en el sitio.
        /// </summary>
        private void btnCheck_Click(object sender, EventArgs e)
        {
            //Tomamos la libreria pasada por el usuario
            string spoUser = this.txbUserName.Text;
            string spoPass = this.txbPass.Text;
            SecureString password = FetchPassword(spoPass);
            string spoSite = this.txbSPSite.Text;
            string library = this.txbSPLibrary.Text;
            try
            {
                using (var ctx = new ClientContext(spoSite))
                {
                    //Creamos las credenciales de SharePoint para conectarnos al sitio web pasado
                    ctx.Credentials = new SharePointOnlineCredentials(spoUser, password);
                    Web web = ctx.Web;
                    Microsoft.SharePoint.Client.List list = web.Lists.GetByTitle(library);
                    ctx.Load(list);
                    ctx.ExecuteQuery();
                    this.imgSB.Visible = true;
                    ManageControls(false, false, false, false, true, true, false, false, true, true,false,true,true,true,true,true);
                }
            }
            catch (Exception ex)
            {
                if (ex is Microsoft.SharePoint.Client.ServerException)
                {
                    WriteToLog("Error al buscar la biblioteca de SharePoint: La biblioteca no existe.");
                    MessageBox.Show("Error al buscar la biblioteca de SharePoint: La biblioteca no existe.", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    //Limpiamos los TextBox
                    this.txbSPLibrary.Text = "";
                }
                else if (ex is System.ArgumentException)
                {
                    WriteToLog("Error al buscar la biblioteca de SharePoint: El campo Biblioteca SharePoint no puede estar vacío.");
                    MessageBox.Show("Error al buscar la biblioteca de SharePoint: El campo Biblioteca SharePoint no puede estar vacío.", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    //Limpiamos los TextBox
                    this.txbSPLibrary.Text = "";
                }
                else
                {
                    WriteToLog("ERROR AL BUSCAR LA BIBLIOTECA " + library + "ERROR: " + ex);
                    MessageBox.Show("ERROR AL BUSCAR LA BIBLIOTECA " + library + "ERROR: " + ex, "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    //Limpiamos los TextBox
                    this.txbSPLibrary.Text = "";
                }
            }
        }
        /// <summary>
        /// Este método lleva a cabo todo el proceso de copiado de ficheros a sus carpetas.
        /// También comprueba si las carpetas existen.
        /// En el caso de que las carpetas no existan las crea.
        /// </summary>
        private void btnCopy_Click(object sender, EventArgs e)
        {
            ManageControls(false, false, false, false, true, true, false, false, true, true, true, true, true, true, true,true);
            //Tomamos los datos del usuario para establecer conexión
            string spoUser = this.txbUserName.Text;
            string spoPass = this.txbPass.Text;
            SecureString password = FetchPassword(spoPass);
            //Tomamos el sitio, la libreria de SharePoint y el directorio local seleccionado
            string spoSite = this.txbSPSite.Text;
            string library = this.txbSPLibrary.Text;
            string localPath = this.txbLocalDirectory.Text;
            string fullLibraryPath = spoSite + "/" + library;
            //Montamos la fecha pasada por el usuario
            string dtDate = this.dtNomina.Text;
            string[] date = dtDate.Split(',');
            //string[] arrDate = date.Split(',');
            //string nomDate = arrDate[1].Replace(" ", "");

            //Variable que controla si la carpeta donde se va a almacenar existe
            bool exists = false;
            Dictionary<string, bool> dnisfoundinldap = new Dictionary<string, bool>();
            //variable para controlar el tipo de documento seleccionado
            string typeName;
            //Tomamos el tipo de documento
            if (rdbNom.Checked == true)
            {
                typeName = "Nómina";
            }
            else if (rdbCer.Checked == true)
            {
                typeName = "Certificado";
            }
            else if (rdbExtra.Checked == true)
            {
                typeName = "Extra";
            }
            else
            {
                typeName = "Modelo145";
            }
            var result = MessageBox.Show("¿Seguro que quiere copiar los documentos a la libreria " + library + "?", "Copiar Documentos", MessageBoxButtons.YesNo);
            if (result == DialogResult.Yes)
            {
                //Comenzamos el proceso
                try
                {
                    UpdateLabel("COPIANDO: Espere Por favor...", 0);
                    using (var ctx = new ClientContext(spoSite))
                    {
                        //Nos conectamos al sitio y tomamos el conexto de la Web
                        ctx.Credentials = new SharePointOnlineCredentials(spoUser, password);
                        Web web = ctx.Web;
                        //Cargamos la biblioteca de SharePoint
                        Microsoft.SharePoint.Client.List list = web.Lists.GetByTitle(library);
                        ctx.Load(list);
                        ctx.ExecuteQuery();
                        //Recorremos los ficheros del directorio local pasado por el usuario uno por uno
                        string[] filePaths = Directory.GetFiles(localPath);
                        foreach (string file in filePaths)
                        {
                            //Creamos el fichero
                            FileCreationInformation newFile = CreateFile(file);
                            //Creamos el nombre de la carpeta
                            string fName = CreateFolderName(newFile);
                            //Montamos el nombre del fichero
                            string dtfileName = CreateFileName(date[0],date[1], fName, file, typeName);
                            //Comprobamos si existe en la biblioteca la carpeta correspondiente
                            string folderUrl = spoSite + "/" + library + "/" + fName;
                            Folder folder = web.GetFolderByServerRelativeUrl(folderUrl);
                            try
                            {
                                //Comprobamos si la carpeta Existe
                                ctx.Load(folder);
                                ctx.ExecuteQuery();
                                //Si existe establecemos la variable a TRUE
                                exists = true;
                            }
                            catch (Exception)
                            {
                                //Si la carpeta no existe establecemos la variable a FALSE
                                exists = false;
                            }
                            //Si la carpeta ya existe añadimos el fichero
                            if (exists != false)
                            {
                                //Cambiamos el nombre del fichero
                                newFile.Url = dtfileName;
                                //Lo añadimos
                                Microsoft.SharePoint.Client.File uploadFile = folder.Files.Add(newFile);
                                ctx.Load(uploadFile);
                                ctx.ExecuteQuery();
                            }
                            else
                            {
                                //Si no existe la carpeta creamos la carpeta
                                FolderCollection folders = list.RootFolder.Folders;
                                ctx.Load(folders);
                                Folder newFolder = folders.Add(fName);
                                ctx.ExecuteQuery();
                                //PROCESO DE PERMISOS
                                SetPermissions(ctx, newFolder, "Nominas_Admin", "Nominas_Admin", fName);
                                //Añadimos el fichero a la carpeta
                                newFile.Url = dtfileName;
                                Microsoft.SharePoint.Client.File uploadFile = newFolder.Files.Add(newFile);
                                ctx.ExecuteQuery();
                            }
                            dnisfoundinldap.Add(fName, false);
                        }
                        List<string> notinfiles = setuserpermision(ref dnisfoundinldap, ctx, spoSite, library);
                        ManageControls(false, false, false, false, true, true, false, false, true, true, false, false, true, true,true,true);
                        MessageBox.Show("COPIADO CON ÉXITO", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        WriteToLog("Usuarios no incluidos en las nóminas " + notinfiles.Count());
                        WriteToLog("Usuarios incluidos con nóminas" + dnisfoundinldap.Where(u => u.Value == false).Count());
                        WriteToLog("Eliminando documentos locales" + dnisfoundinldap.Where(u => u.Value == false).Count());
                        UpdateLabel("Eliminando documentos locales...", 0);
                        foreach (string file in filePaths)
                        {
                            System.IO.File.Delete(file);
                        }
                        WriteToLog("Documentos locales eliminados" + dnisfoundinldap.Where(u => u.Value == false).Count());
                    }
                    UpdateLabel("COMPLETADO", 0);
                }
                catch (Exception ex)
                {
                    if (ex is System.IO.DirectoryNotFoundException)
                    {
                        this.label16.Visible = false;
                        WriteToLog("ERROR AL COPIAR LOS FICHEROS A LA BIBLIOTECA " + library + " ERROR: " + "El directorio especificado no existe en su equipo.");
                        MessageBox.Show("ERROR AL COPIAR LOS FICHEROS A LA BIBLIOTECA " + library + " ERROR: " + "El directorio especificado no existe en su equipo.", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        ManageControls(false, false, false, false, true, true, false, false, true, true, false, false,true,true,true,true);
                    }
                    else
                    {
                        WriteToLog("ERROR AL COPIAR LOS FICHEROS A LA BIBLIOTECA " + library + "ERROR: " + ex);
                            
                        ManageControls(false, false, false, false, true, true, false, false, true, true, false, false,true,true,true,true);
                    }

                }
            }
        }
        /// <summary>
        /// Recorremos todos los usuarios y damos permisos a los correspondientes sobre la carpeta de su correspondiente nif
        /// <paramref name="dnisfoundinldap">Lista con todos los NIF de las carpetas o PDFs</param>
        /// <paramref name="ctx">Contexto del sitio</paramref>
        /// <paramref name="library">Libreria donde se encuentran las carpetas para dar permisos</paramref>
        /// <paramref name="site">Nombre del sitio</paramref>
        /// </summary>
        private List<string> setuserpermision(ref Dictionary<string, bool> dnisfoundinldap,ClientContext ctx,string site,string library)
        {
            //dnis encontrados en ldap y no en los ficheros
            List<string> res = new List<string>();

            //empezamos pidiendo los usuarios al ldap
            Web web = ctx.Web;
            ctx.Load(web, w => w.SiteUsers);
            var siteUsers = web.SiteUsers;
            ctx.ExecuteQuery();
            PeopleManager peopleManager = new PeopleManager(ctx);

            int totalSiteUsers = siteUsers.Count;
            progressBar1.Maximum = totalSiteUsers+1;
            progressBar1.Value = 0;
            int count = 0;

            foreach (var user in siteUsers)
            {
                count++;
                UpdateLabel("PROCESANDO USUARIOS: " + count + " / " + totalSiteUsers,count);

                try
                {
                    var userProfile = peopleManager.GetPropertiesFor(user.LoginName);
                    ctx.Load(userProfile);
                    ctx.Load(userProfile, p => p.UserProfileProperties);
                    ctx.ExecuteQuery();
                    string nif = userProfile.UserProfileProperties["NIF"];

                    if (dnisfoundinldap.ContainsKey(nif))
                    {
                        WriteToLog("SI OTORGAR PERMISOS: " + user.LoginName);
                        RoleDefinition readroletypes = ctx.Web.RoleDefinitions.GetByType(RoleType.Reader);
                        ctx.ExecuteQuery();
                        //Asignamos los permisos a la carpeta
                        RoleDefinitionBindingCollection collRoleDefinitionBindingRead = new RoleDefinitionBindingCollection(ctx);
                        collRoleDefinitionBindingRead.Add(readroletypes);
                        String folderUrl = site +"/"+ library + "/" + nif;
                        Folder folder = web.GetFolderByServerRelativeUrl(folderUrl);
                        folder.ListItemAllFields.RoleAssignments.Add(user, collRoleDefinitionBindingRead);
                        folder.Update();
                        ctx.ExecuteQuery();
                        dnisfoundinldap[nif] = true;
                    }
                    else
                    {
                        WriteToLog("NO OTORGAR PERMISOS: " + user.LoginName);
                        //el nif esta en ldap pero no en el fichero de nominas
                        res.Add(nif);
                    }
                }
                catch(Exception ex)
                {
                    WriteToLog("USUARIO SIN PERFIL: " + user.LoginName);
                    WriteToLog("ERROR INESPERADO DEBIDO A QUE NO SE ENCUENTRA EL USUARIO EN EL UPS: "+ ex);
                }
            }
                return res;
            }

        /// <summary>
        /// Método que crea el fichero que vamos a subir a la biblioteca
        /// <paramref name="file">Nombre del fichero</paramref>
        /// </summary>
        private static FileCreationInformation CreateFile(string file)
        {
            // Preparamos el fichero para subirlo a la biblioteca de SharePoint
            FileCreationInformation newFile = new FileCreationInformation
            {
                Overwrite = true,
                Content = System.IO.File.ReadAllBytes(file),
                Url = System.IO.Path.GetFileName(file)
            };
            return newFile;
        }
        /// <summary>
        /// Método que crea el nombre del fichero si fecha para buscar o crear la carpeta
        /// <paramref name="newFile">Fichero</paramref>
        /// </summary>
        private static string CreateFolderName(FileCreationInformation newFile)
        {
            string[] arrFile = newFile.Url.Split('.');
            string fileName = arrFile[0];
            return fileName;
        }
        /// <summary>
        /// Método que crea el nombre del fichero para subirlo, pero con fecha (Se usará para subir los ficheros)
        /// <paramref name="newFile">Fichero</paramref>
        /// </summary>
        private static string CreateFileName(string nomDatemonth,string nomDateyear, string fileName, string file,string typeName)
        {
            //Tomamos la extensión del archivo
            string[] arrExt = file.Split('.');
            string fileExtension = arrExt[1];
            //Montamos el nombre del fichero
            string dtfileName = nomDatemonth + "_" + typeName + "_" + fileName +"_"+ nomDateyear+ "." + fileExtension;
            return dtfileName;
        }
        /// <summary>
        /// Este método añade los permisos sobre la carpeta
        /// </summary>
        private static void SetPermissions(ClientContext ctx, Folder newFolder, String rrhhGroup, String adminGroup, String userNif)
        {
            Group rrhhGrp = null;
            Group adminGrp = null;
            //Rompemos la herencia de la carpeta
            newFolder.ListItemAllFields.BreakRoleInheritance(false, true);
            ctx.ExecuteQuery();

            //Cargamos todos los grupos del sitio
            GroupCollection groupColl = ctx.Web.SiteGroups;
            ctx.Load(groupColl,
                groups => groups.Include
                (
                    group => group.Title,
                    group => group.Id)
                );
            ctx.ExecuteQuery();
            //Tomamos los grupos correspondientes
            foreach (Group siteGroup in groupColl)
            {
                //En el caso de que sea el grupo de Recursos Humanos
                if (siteGroup.Title.Equals(rrhhGroup))
                {
                    rrhhGrp = siteGroup;
                    //Tomamos los permisos de contribuir del sitio
                    RoleDefinition contributeroletypes = ctx.Web.RoleDefinitions.GetByType(RoleType.Contributor);
                    ctx.ExecuteQuery();
                    //Asignamos los permisos a la carpeta
                    RoleDefinitionBindingCollection collRoleDefinitionBindingContribute = new RoleDefinitionBindingCollection(ctx);
                    collRoleDefinitionBindingContribute.Add(contributeroletypes);
                    newFolder.ListItemAllFields.RoleAssignments.Add(rrhhGrp, collRoleDefinitionBindingContribute);
                    newFolder.Update();
                    ctx.ExecuteQuery();
                }
                //En el caso de que sea el grupo de Administradores
                if (siteGroup.Title.Equals(adminGroup))
                {
                    adminGrp = siteGroup;
                    //Tomamos los permisos de contribuir del sitio
                    RoleDefinition adminroletypes = ctx.Web.RoleDefinitions.GetByType(RoleType.Administrator);
                    ctx.ExecuteQuery();
                    //Asignamos los permisos a la carpeta
                    RoleDefinitionBindingCollection collRoleDefinitionBindingAdmin = new RoleDefinitionBindingCollection(ctx);
                    collRoleDefinitionBindingAdmin.Add(adminroletypes);
                    newFolder.ListItemAllFields.RoleAssignments.Add(adminGrp, collRoleDefinitionBindingAdmin);
                    newFolder.Update();
                    ctx.ExecuteQuery();
                }
            }
        }
        /// <summary>
        /// Este método limpia la parte inferior del formulario
        /// Se usa cuando el usuario pulsa sobre el botón de clean
        /// </summary>
        private void btnClean_Click(object sender, EventArgs e)
        {
            this.label16.Visible = false;
            this.txbSPLibrary.Text = "";
            this.txbSPLibrary.Enabled = true;
            this.txbLocalDirectory.Text = "";
            this.btnCheck.Enabled = true;
            this.dtNomina.Enabled = true;
            DateTimePicker dtNomina = new DateTimePicker();
            this.dtNomina.Value = DateTime.Now;
            this.imgSB.Visible = false;
            this.imgDL.Visible = false;
        }
        /// <summary>
        /// Este método controla la habilitación o deshabilitación de todos los componentes del formulario
        /// </summary>
        /// <param name="btnBrowse">Botón de Navegación por directorios locales</param>
        /// <param name="btncheck">Botón que comprueba si existe la biblioteca pasada en el sitio de SharePoint</param>
        /// <param name="btnclear">Botón que limpia la parte inferior del formulario</param>
        /// <param name="btnConnect">Botón que conecta al usuario con SharePoint Online</param>
        /// <param name="btndisconnect">Botón que desconecta al usuario de SharePoint Online</param>
        /// <param name="txbLocalDir">Caja de texto donde introducir la ruta del directorio local</param>
        /// <param name="txbPass">Caja de Texto para introducir la contraseña de usuario</param>
        /// <param name="txbSPLibrary">Caja de texto para introducir la libreria</param>
        /// <param name="txbSpsite">Caja de texto para introducir el sitio de SharePoint Online</param>
        /// <param name="txbUserName">Caja de texto para introducir el usuario de SharePoint Online</param>
        ///<param name="dtnom">Control de Fecha para las nominas</param>
        private void ManageControls(bool txbSpsite, bool txbUserName, bool txbPass, bool btnConnect, bool txbLocalDir, bool btnBrowse, bool txbSPLibrary, bool btncheck, bool btndisconnect, bool btnclear, bool imgLoad, bool dtnom,bool rdbNom, bool rdbCer, bool rd145, bool rdExtra)
        {
            this.btnConnect.Enabled = btnConnect;
            this.txbLocalDirectory.Enabled = txbLocalDir;
            this.btnBrowse.Enabled = btnBrowse;
            this.txbSPLibrary.Enabled = txbSPLibrary;
            this.txbSPSite.Enabled = txbSpsite;
            this.txbPass.Enabled = txbPass; 
            this.txbUserName.Enabled = txbUserName;
            this.btnCheck.Enabled = btncheck;
            this.btnDisconnect.Enabled = btndisconnect;
            this.btnClean.Enabled = btnclear;
            this.dtNomina.Enabled = dtnom;
            this.rdbNom.Enabled = rdbNom;
            this.rdbCer.Enabled = rdbCer;
            this.rdb145.Enabled = rd145;
            this.rdbExtra.Enabled = rdExtra;
        }
        /// <summary>
        /// Este método limpia por completo el formulario
        /// Se usa cuando el usuario se desconecta del sitio de SharePoint Online
        /// </summary>
        private void ClearForm()
        {
            //Limpiamos los TextBox
            this.txbSPSite.Text = "";
            this.txbUserName.Text = "";
            this.txbPass.Text = "";
            this.txbLocalDirectory.Text = "";
            this.txbSPLibrary.Text = "";
            DateTimePicker dtNomina = new DateTimePicker();
            this.dtNomina.Value = DateTime.Now;
            this.imgSB.Visible = false;
            this.imgDL.Visible = false;
            this.imgDocType.Visible = false;
            this.imgFecha.Visible = false;
            this.lblStatus.ForeColor = System.Drawing.Color.DarkRed;
            this.lblStatus.Text = "Estado: Desconectado";
            //Inhabilitamos los componentes
            ManageControls(false, true, true, true, false, false, false, false, false, false,false,false,false,false,false,false);
        }
        /// <summary>
        /// Este método controla cuando se ha introducido texto en el TextBox del Site a conectarse
        /// El el caso de que se introduzca texto se habilitaran las dos cajas de texto "User" y "Pass"
        /// </summary>
        private void txbSPSite_TextChanged(object sender, EventArgs e)
        {
            if (this.txbSPSite.Text != "")
            {
                ManageControls(true, true, true, true, false, false, false,false,false,false,false, false,false,false,false,false);
            }
            else
            {
                ManageControls(true,false,false, false, false, false, false,false,false,false,false,false,false,false,false,false);
            }
        }
        /// <summary>
        /// Este método lanza la conexión con sharepoint si se pulsa el botón "Enter" mientras el foco está en el TextBox del Site
        /// </summary>
        private void txbSPSite_KeyPressed(object sender, KeyEventArgs e)
        {
            //Si se ha pulsado la tecla Enter
            if (e.KeyCode == Keys.Enter)
            {
                ConnectToSPO();
            }
        }
        /// <summary>
        /// Este método lanza la conexión con sharepoint si se pulsa el botón "Enter" mientras el foco está en el TextBox del UserName
        /// </summary>
        private void txbUserName_KeyPressed(object sender, KeyEventArgs e)
        {
            //Si se ha pulsado la tecla Enter
            if (e.KeyCode == Keys.Enter)
            {
                ConnectToSPO();
            }
        }
        /// <summary>
        /// Este método lanza la conexión con sharepoint si se pulsa el botón "Enter" mientras el foco está en el TextBox de la Password
        /// </summary>
        private void txbPass_KeyPressed(object sender, KeyEventArgs e)
        {
            //Si se ha pulsado la tecla Enter
            if (e.KeyCode == Keys.Enter)
            {
                ConnectToSPO();
            }
        }
        /// <summary>
        /// Este método hace que cuando se introduzca texto en la caja de "Directorio Local" aparezca el check
        /// En caso de que se borre el texto, el check desaparecerá
        /// </summary>
        private void txbLocalDirectory_TextChanged(object sender, EventArgs e)
        {
            if (this.txbLocalDirectory.Text != "")
            {
                this.imgDL.Visible = true;
            }
            else
            {
                this.imgDL.Visible = false;
            }
        }
        /// <summary>
        /// Este método hace que cargue el "Browser" de seleccionar el fichero PDF Maestro
        /// </summary>
        private void btnBrowseMaster_Click(object sender, EventArgs e)
        {
            OpenFileDialog choofdlog = new OpenFileDialog();
            choofdlog.Filter = "All Files (*.*)|*.*";
            choofdlog.FilterIndex = 1;
            choofdlog.Multiselect = true;

            if (choofdlog.ShowDialog() == DialogResult.OK)
            {
                string sFileName = choofdlog.FileName;
                string[] arrAllFiles = choofdlog.FileNames;
                this.txbPDFMaster.Text = sFileName;
            }
        }
        /// <summary>
        /// Este método hace que cargue el "Browser" de seleccionar el directorio destino de las particiones
        /// </summary>
        private void btnSaveMaster_Click(object sender, EventArgs e)
        {
            FolderBrowserDialog folderDlg = new FolderBrowserDialog();
            FileSystemWatcher fsWatcher = new FileSystemWatcher();
            folderDlg.ShowNewFolderButton = true;

            DialogResult result = folderDlg.ShowDialog();
            if (result == DialogResult.OK)
            {
                txbSavePDFMaster.Text = folderDlg.SelectedPath;
                Environment.SpecialFolder root = folderDlg.RootFolder;
            }
        }
        /// <summary>
        /// Este método lleva a cabo todo el proceso de particionado
        /// lee imagenes de un pdf, luego saca el texto de cada imagen, y de una zona predefinida de la misma
        /// </summary>
        private void btnParticionar_Click(object sender, EventArgs e)
        {
            if (this.txbPDFMaster.Text == "" && this.txbSavePDFMaster.Text == "")
            {
                MessageBox.Show("Debe rellenar los dos campos: Documento Principal y Destino de la Partición", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            else if (this.txbPDFMaster.Text != "" && this.txbSavePDFMaster.Text == "")
            {
                MessageBox.Show("Debe rellenar los dos campos: Documento Principal y Destino de la Partición", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            else if (this.txbPDFMaster.Text == "" && this.txbSavePDFMaster.Text != "")
            {
                MessageBox.Show("Debe rellenar los dos campos: Documento Principal y Destino de la Partición", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            else
            {
                WriteToLog("Particionando Documento");
                string masterPdfPath = this.txbPDFMaster.Text;
                string destinyPath = this.txbSavePDFMaster.Text;
               // ManageControls(false, false, false, false, false, false, false, false, false, false, false, false,false,false);
                try
                {
                    SplitPDF(masterPdfPath, destinyPath);
                    //ManageControls(true, false, false, false, false, false, false, false, false, false, false, false,false,false);
                    WriteToLog("Particionado con Éxito");
                    MessageBox.Show("Particionado con Éxito", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    Process.Start(this.txbSavePDFMaster.Text);
                    this.txbLocalDirectory.Text = destinyPath;
                }
                catch (Exception ex)
                {
                    if (ex is System.IO.IOException)
                    {
                        WriteToLog("Error de Particionado: Uno de los directorios no existe en este equipo");
                        MessageBox.Show("Error de Particionado: Uno de los directorios no existe en este equipo", "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        //ManageControls(true, false, false, false, false, false, false, false, false, false, false, false,false,false);
                    }
                    else
                    {
                        WriteToLog("Error de Particionado: " + ex);
                        MessageBox.Show("Error de Particionado: " + ex, "GRUPO VASS - RRHH - Nóminas", MessageBoxButtons.OK, MessageBoxIcon.Error);
                       // ManageControls(true, false, false, false, false, false, false, false, false, false, false, false,false,false);
                    }
                }
            }
        }
        /// <summary>
        /// Este método lleva a cabo la separación del PDF maestro a PDFs individuales
        /// <paramref name="outputPDFpath">Ruta donde se va a guardar los PDFs</paramref>
        /// <paramref name="pdfpath">Ruta del fichero PDF maestro</paramref>
        /// </summary>
        private static void SplitPDF(string pdfpath,string outputPDFpath)
        {
            //Guardamos cuantas paginas tiene cada DNI
            Dictionary<string, int> dnipages = new Dictionary<string, int>();
            PdfReader reader = null;
            //Inicializamos el recorrido de las paginas
            int startpage = 1;
            //Le indicamos el PDF a leer
            reader = new PdfReader(pdfpath);
            //Declaramos la variable de DNI anterior para comprobar si las paginas son varias o unica
            string dniant = "";
            //Declaramos la variable Page Count (contador de paginas)
            int pc = 1;
            //recorre todas las paginas del PDF
            for (int i = startpage; i <= reader.NumberOfPages; i++)
            {
                //Toma el texto de la primera página
                String text = PdfTextExtractor.GetTextFromPage(reader, i);
                //Tomamos todas las palabras de 9 letras (tamaño dni) sin caracteres raros
                List<string> dnis = text.Replace("\n","").Split(' ').Where(u => u.Length == 9).ToList();
                //Variable dniVal almacena el DNI
                String dnival = "";
                //recorremos todas las palabras de 9 letras y comprobamos que es un DNI valido
                foreach (var x in dnis)
                {
                    if (IsValid(x))
                    {
                        //Si es un DNI Valido lo almacenamos en la variable dnival
                        dnival = x;
                    }
                }
                //Comprobamos si es el mismo dni que el anterior 
                //Necesario para montar una pagina o las necesarias
                if (dniant != dnival)
                {
                    dniant = dnival;
                    pc = 1;
                    dnipages.Add(dnival, pc);
                }
                else
                {
                    pc++;
                    dnipages[dnival] = pc;
                }
            }
            //Dejamos de leer
            reader.Close();
            reader = new PdfReader(pdfpath);
            int p = 0;
            foreach (var dni in dnipages)
            {
                string path2 = outputPDFpath +"\\"+ dni.Key + ".pdf";
                using (Stream outputPdfStream = new FileStream(path2, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    Document document = new Document();
                    PdfSmartCopy copy = new PdfSmartCopy(document, outputPdfStream);
                    document.Open();
                    for (int t = 0; t < dni.Value; t++)
                    {   
                        p++;
                        copy.AddPage(copy.GetImportedPage(reader, p));
                    }
                    copy.FreeReader(reader);
                    document.Close();
                }
            }
            reader.Close();
        }
        /// <summary>
        /// Método que comprueba si el texto de 9 letras pasado es Válido y corresponde a un DNI
        /// </summary>
        /// <param name="NIF">Texto de 9 carácteres</param>
        /// <returns> Devuelve un valor booleano en el caso de que el DNI sea correcto</returns>
        public static bool IsValid(string NIF)
        {
            //Controlamos primero si es un NIE con Guiones
            //En caso de que tenga guiones los reemplazamos
            if (NIF.Contains("-"))
            {
                NIF = NIF.Replace("-","");
            }
            string patron = "[A-HJ-NP-SUVW][0-9]{7}[0-9A-J]|\\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]|[X]\\d{7}[TRWAGMYFPDXBNJZSQVHLCKE]|[X]\\d{8}[TRWAGMYFPDXBNJZSQVHLCKE]|[YZ]\\d{0,7}[TRWAGMYFPDXBNJZSQVHLCKE]";
            string sRemp = "";
            bool ret = false;
            System.Text.RegularExpressions.Regex rgx = new System.Text.RegularExpressions.Regex(patron);
            sRemp = rgx.Replace(NIF.ToString(), "OK");
            if (sRemp == "OK") ret = true;
            return ret;
        }
        /// <summary>
        /// Método que captura cualquier cambio en las imagenes de los checks
        /// En el caso de que los tres checks sean visibles se habilita el botón de Copiado
        /// En el caso contrario el botón de copiado sigue inhabilitado
        /// </summary>
        private void ImgDL_VisibleChanged(object sender, EventArgs e)
        {
            if (this.imgSB.Visible == true && this.imgDL.Visible == true && this.imgFecha.Visible ==true)
            {
                this.btnCopy.Enabled = true;
            }
            else
            {
                this.btnCopy.Enabled = false;
            }
        }
        /// <summary>
        /// Método que actualiza el Label del proceso de copia
        ///<paramref name="Text"/>Texto a mostrar</paramref>
        ///<paramref name="val">Valor de la Label</paramref>
        /// </summary>
        private void UpdateLabel(string Text,int val)
        {
            this.label16.Visible = true;

            this.Invoke(new MethodInvoker(delegate
            {
                label16.Text = Text;
                label16.Update();
            }));

            this.Invoke(new MethodInvoker(delegate
            {
                progressBar1.Value = val;
                progressBar1.Update();
            }));
        }
        /// <summary>
        /// Método que pinta en el Log todos los procesos y errores
        /// <paramref name="showmessage">Booleano que controla si hay permisos o no</paramref>
        ///<paramref name="text"> Mensaje a mostrar personalizado</paramref>
        /// </summary>
        private void WriteToLog(string text,bool showmessage=false)
        {
            try
            {
                using (StreamWriter sw = new StreamWriter(logPath, true))
                {
                    sw.WriteLine(DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss") + "    " + text);
                }
            }
            catch (Exception Ex)
            {
                if (showmessage)
                {
                    MessageBox.Show("NO TIENE PERMISOS PARA ESCRIBIR EL LOG");
                }
            }
        }
    }
}

