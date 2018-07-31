namespace Nominas
{
    partial class Form1
    {
        /// <summary>
        /// Variable del diseñador necesaria.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Limpiar los recursos que se estén usando.
        /// </summary>
        /// <param name="disposing">true si los recursos administrados se deben desechar; false en caso contrario.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Código generado por el Diseñador de Windows Forms

        /// <summary>
        /// Método necesario para admitir el Diseñador. No se puede modificar
        /// el contenido de este método con el editor de código.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.label1 = new System.Windows.Forms.Label();
            this.txbUserName = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.txbPass = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.txbSPSite = new System.Windows.Forms.TextBox();
            this.txbSPLibrary = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.btnBrowse = new System.Windows.Forms.Button();
            this.label5 = new System.Windows.Forms.Label();
            this.txbLocalDirectory = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.btnConnect = new System.Windows.Forms.Button();
            this.btnCopy = new System.Windows.Forms.Button();
            this.btnCheck = new System.Windows.Forms.Button();
            this.btnClean = new System.Windows.Forms.Button();
            this.btnDisconnect = new System.Windows.Forms.Button();
            this.label8 = new System.Windows.Forms.Label();
            this.dtNomina = new System.Windows.Forms.DateTimePicker();
            this.lblTime = new System.Windows.Forms.Label();
            this.timer1 = new System.Windows.Forms.Timer(this.components);
            this.lblStatus = new System.Windows.Forms.Label();
            this.label9 = new System.Windows.Forms.Label();
            this.label10 = new System.Windows.Forms.Label();
            this.txbPDFMaster = new System.Windows.Forms.TextBox();
            this.label11 = new System.Windows.Forms.Label();
            this.btnBrowseMaster = new System.Windows.Forms.Button();
            this.txbSavePDFMaster = new System.Windows.Forms.TextBox();
            this.btnSaveMaster = new System.Windows.Forms.Button();
            this.btnParticionar = new System.Windows.Forms.Button();
            this.label12 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.label13 = new System.Windows.Forms.Label();
            this.label14 = new System.Windows.Forms.Label();
            this.label15 = new System.Windows.Forms.Label();
            this.imgSB = new System.Windows.Forms.PictureBox();
            this.imgFecha = new System.Windows.Forms.PictureBox();
            this.imgDL = new System.Windows.Forms.PictureBox();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.label16 = new System.Windows.Forms.Label();
            this.progressBar1 = new System.Windows.Forms.ProgressBar();
            this.rdbNom = new System.Windows.Forms.RadioButton();
            this.rdbCer = new System.Windows.Forms.RadioButton();
            this.label17 = new System.Windows.Forms.Label();
            this.imgDocType = new System.Windows.Forms.PictureBox();
            this.rdb145 = new System.Windows.Forms.RadioButton();
            this.rdbExtra = new System.Windows.Forms.RadioButton();
            ((System.ComponentModel.ISupportInitialize)(this.imgSB)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.imgFecha)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.imgDL)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.imgDocType)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(35, 372);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(113, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Usuario Office 365";
            // 
            // txbUserName
            // 
            this.txbUserName.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txbUserName.Location = new System.Drawing.Point(202, 369);
            this.txbUserName.Name = "txbUserName";
            this.txbUserName.Size = new System.Drawing.Size(173, 20);
            this.txbUserName.TabIndex = 1;
            this.txbUserName.KeyUp += new System.Windows.Forms.KeyEventHandler(this.txbUserName_KeyPressed);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(35, 421);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(134, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Contraseña Office 365";
            // 
            // txbPass
            // 
            this.txbPass.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txbPass.Location = new System.Drawing.Point(202, 418);
            this.txbPass.MaxLength = 20;
            this.txbPass.Name = "txbPass";
            this.txbPass.PasswordChar = '*';
            this.txbPass.Size = new System.Drawing.Size(173, 20);
            this.txbPass.TabIndex = 3;
            this.txbPass.KeyUp += new System.Windows.Forms.KeyEventHandler(this.txbPass_KeyPressed);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(35, 326);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(98, 13);
            this.label3.TabIndex = 4;
            this.label3.Text = "Sitio SharePoint";
            // 
            // txbSPSite
            // 
            this.txbSPSite.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txbSPSite.Location = new System.Drawing.Point(202, 323);
            this.txbSPSite.Name = "txbSPSite";
            this.txbSPSite.Size = new System.Drawing.Size(173, 20);
            this.txbSPSite.TabIndex = 5;
            this.txbSPSite.Text = "https://grupovass.sharepoint.com/es-es/peopleandtalent";
            this.txbSPSite.TextChanged += new System.EventHandler(this.txbSPSite_TextChanged);
            this.txbSPSite.KeyUp += new System.Windows.Forms.KeyEventHandler(this.txbSPSite_KeyPressed);
            // 
            // txbSPLibrary
            // 
            this.txbSPLibrary.Location = new System.Drawing.Point(622, 438);
            this.txbSPLibrary.Name = "txbSPLibrary";
            this.txbSPLibrary.Size = new System.Drawing.Size(193, 20);
            this.txbSPLibrary.TabIndex = 6;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label4.Location = new System.Drawing.Point(487, 442);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(129, 13);
            this.label4.TabIndex = 7;
            this.label4.Text = "Biblioteca SharePoint";
            // 
            // btnBrowse
            // 
            this.btnBrowse.Location = new System.Drawing.Point(821, 355);
            this.btnBrowse.Name = "btnBrowse";
            this.btnBrowse.Size = new System.Drawing.Size(54, 23);
            this.btnBrowse.TabIndex = 8;
            this.btnBrowse.Text = "𝖡𝗋𝗈𝗐𝗌𝖾";
            this.btnBrowse.UseVisualStyleBackColor = true;
            this.btnBrowse.Click += new System.EventHandler(this.browse_Click);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label5.Location = new System.Drawing.Point(487, 360);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(97, 13);
            this.label5.TabIndex = 9;
            this.label5.Text = "Directorio Local";
            // 
            // txbLocalDirectory
            // 
            this.txbLocalDirectory.Location = new System.Drawing.Point(622, 356);
            this.txbLocalDirectory.Name = "txbLocalDirectory";
            this.txbLocalDirectory.Size = new System.Drawing.Size(193, 20);
            this.txbLocalDirectory.TabIndex = 10;
            this.txbLocalDirectory.TextChanged += new System.EventHandler(this.txbLocalDirectory_TextChanged);
            // 
            // label6
            // 
            this.label6.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.label6.Location = new System.Drawing.Point(-10, 134);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(1000, 2);
            this.label6.TabIndex = 11;
            this.label6.Text = "label6";
            // 
            // btnConnect
            // 
            this.btnConnect.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnConnect.Location = new System.Drawing.Point(42, 472);
            this.btnConnect.Name = "btnConnect";
            this.btnConnect.Size = new System.Drawing.Size(82, 49);
            this.btnConnect.TabIndex = 12;
            this.btnConnect.Text = "𝖢𝗈𝗇𝖾𝖼𝗍𝖺𝗋";
            this.btnConnect.UseVisualStyleBackColor = true;
            this.btnConnect.Click += new System.EventHandler(this.btnConnect_Click);
            // 
            // btnCopy
            // 
            this.btnCopy.Location = new System.Drawing.Point(500, 472);
            this.btnCopy.Name = "btnCopy";
            this.btnCopy.Size = new System.Drawing.Size(75, 49);
            this.btnCopy.TabIndex = 13;
            this.btnCopy.Text = "𝖢𝗈𝗉𝗂𝖺𝗋";
            this.btnCopy.UseVisualStyleBackColor = true;
            this.btnCopy.Click += new System.EventHandler(this.btnCopy_Click);
            // 
            // btnCheck
            // 
            this.btnCheck.Location = new System.Drawing.Point(821, 438);
            this.btnCheck.Name = "btnCheck";
            this.btnCheck.Size = new System.Drawing.Size(54, 21);
            this.btnCheck.TabIndex = 14;
            this.btnCheck.Text = "𝖢𝗁𝖾𝖼𝗄";
            this.btnCheck.UseVisualStyleBackColor = true;
            this.btnCheck.Click += new System.EventHandler(this.btnCheck_Click);
            // 
            // btnClean
            // 
            this.btnClean.Location = new System.Drawing.Point(853, 472);
            this.btnClean.Name = "btnClean";
            this.btnClean.Size = new System.Drawing.Size(75, 49);
            this.btnClean.TabIndex = 17;
            this.btnClean.Text = "𝖫𝗂𝗆𝗉𝗂𝖺𝗋";
            this.btnClean.UseVisualStyleBackColor = true;
            this.btnClean.Click += new System.EventHandler(this.btnClean_Click);
            // 
            // btnDisconnect
            // 
            this.btnDisconnect.Location = new System.Drawing.Point(354, 472);
            this.btnDisconnect.Name = "btnDisconnect";
            this.btnDisconnect.Size = new System.Drawing.Size(82, 49);
            this.btnDisconnect.TabIndex = 18;
            this.btnDisconnect.Text = "𝖣𝖾𝗌𝖼𝗈𝗇𝖾𝖼𝗍𝖺𝗋";
            this.btnDisconnect.UseVisualStyleBackColor = true;
            this.btnDisconnect.Click += new System.EventHandler(this.btnDisconnect_Click);
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label8.Location = new System.Drawing.Point(487, 401);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(110, 13);
            this.label8.TabIndex = 20;
            this.label8.Text = "Fecha Documento";
            // 
            // dtNomina
            // 
            this.dtNomina.CustomFormat = "MMMM,yyyy";
            this.dtNomina.Format = System.Windows.Forms.DateTimePickerFormat.Custom;
            this.dtNomina.Location = new System.Drawing.Point(622, 397);
            this.dtNomina.Name = "dtNomina";
            this.dtNomina.ShowUpDown = true;
            this.dtNomina.Size = new System.Drawing.Size(193, 20);
            this.dtNomina.TabIndex = 21;
            // 
            // lblTime
            // 
            this.lblTime.AutoSize = true;
            this.lblTime.Location = new System.Drawing.Point(650, 22);
            this.lblTime.Name = "lblTime";
            this.lblTime.Size = new System.Drawing.Size(0, 13);
            this.lblTime.TabIndex = 22;
            // 
            // lblStatus
            // 
            this.lblStatus.AutoSize = true;
            this.lblStatus.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblStatus.ForeColor = System.Drawing.Color.DarkRed;
            this.lblStatus.Location = new System.Drawing.Point(12, 549);
            this.lblStatus.Name = "lblStatus";
            this.lblStatus.Size = new System.Drawing.Size(136, 13);
            this.lblStatus.TabIndex = 24;
            this.lblStatus.Text = "Estado: Desconectado";
            // 
            // label9
            // 
            this.label9.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.label9.Location = new System.Drawing.Point(-10, 268);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(1000, 2);
            this.label9.TabIndex = 30;
            this.label9.Text = "label9";
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label10.Location = new System.Drawing.Point(221, 173);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(124, 13);
            this.label10.TabIndex = 31;
            this.label10.Text = "Documento Principal";
            // 
            // txbPDFMaster
            // 
            this.txbPDFMaster.Location = new System.Drawing.Point(393, 170);
            this.txbPDFMaster.Name = "txbPDFMaster";
            this.txbPDFMaster.Size = new System.Drawing.Size(173, 20);
            this.txbPDFMaster.TabIndex = 32;
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label11.Location = new System.Drawing.Point(221, 216);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(136, 13);
            this.label11.TabIndex = 33;
            this.label11.Text = "Destino de la Partición";
            // 
            // btnBrowseMaster
            // 
            this.btnBrowseMaster.Location = new System.Drawing.Point(574, 168);
            this.btnBrowseMaster.Name = "btnBrowseMaster";
            this.btnBrowseMaster.Size = new System.Drawing.Size(54, 23);
            this.btnBrowseMaster.TabIndex = 34;
            this.btnBrowseMaster.Text = "𝖡𝗋𝗈𝗐𝗌𝖾";
            this.btnBrowseMaster.UseVisualStyleBackColor = true;
            this.btnBrowseMaster.Click += new System.EventHandler(this.btnBrowseMaster_Click);
            // 
            // txbSavePDFMaster
            // 
            this.txbSavePDFMaster.Location = new System.Drawing.Point(393, 213);
            this.txbSavePDFMaster.Name = "txbSavePDFMaster";
            this.txbSavePDFMaster.Size = new System.Drawing.Size(173, 20);
            this.txbSavePDFMaster.TabIndex = 35;
            // 
            // btnSaveMaster
            // 
            this.btnSaveMaster.Location = new System.Drawing.Point(575, 211);
            this.btnSaveMaster.Name = "btnSaveMaster";
            this.btnSaveMaster.Size = new System.Drawing.Size(54, 23);
            this.btnSaveMaster.TabIndex = 36;
            this.btnSaveMaster.Text = "𝖡𝗋𝗈𝗐𝗌𝖾";
            this.btnSaveMaster.UseVisualStyleBackColor = true;
            this.btnSaveMaster.Click += new System.EventHandler(this.btnSaveMaster_Click);
            // 
            // btnParticionar
            // 
            this.btnParticionar.Location = new System.Drawing.Point(687, 168);
            this.btnParticionar.Name = "btnParticionar";
            this.btnParticionar.Size = new System.Drawing.Size(75, 66);
            this.btnParticionar.TabIndex = 37;
            this.btnParticionar.Text = "𝖯𝖺𝗋𝗍𝗂𝖼𝗂𝗈𝗇𝖺𝗋";
            this.btnParticionar.UseVisualStyleBackColor = true;
            this.btnParticionar.Click += new System.EventHandler(this.btnParticionar_Click);
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(22, 136);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(115, 13);
            this.label12.TabIndex = 39;
            this.label12.Text = "Particionar Documento";
            // 
            // label7
            // 
            this.label7.BackColor = System.Drawing.Color.LightGray;
            this.label7.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.label7.Location = new System.Drawing.Point(471, 270);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(10, 293);
            this.label7.TabIndex = 40;
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(22, 271);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(51, 13);
            this.label13.TabIndex = 41;
            this.label13.Text = "Conexión";
            // 
            // label14
            // 
            this.label14.BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
            this.label14.Location = new System.Drawing.Point(-1, 562);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(1000, 2);
            this.label14.TabIndex = 42;
            this.label14.Text = "label14";
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(487, 271);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(46, 13);
            this.label15.TabIndex = 43;
            this.label15.Text = "Copiado";
            // 
            // imgSB
            // 
            this.imgSB.ImageLocation = "Images\\greenCheck.png";
            this.imgSB.Location = new System.Drawing.Point(881, 431);
            this.imgSB.Name = "imgSB";
            this.imgSB.Size = new System.Drawing.Size(56, 35);
            this.imgSB.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.imgSB.TabIndex = 27;
            this.imgSB.TabStop = false;
            this.imgSB.VisibleChanged += new System.EventHandler(this.ImgDL_VisibleChanged);
            // 
            // imgFecha
            // 
            this.imgFecha.ImageLocation = "Images\\greenCheck.png";
            this.imgFecha.Location = new System.Drawing.Point(821, 390);
            this.imgFecha.Name = "imgFecha";
            this.imgFecha.Size = new System.Drawing.Size(56, 35);
            this.imgFecha.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.imgFecha.TabIndex = 26;
            this.imgFecha.TabStop = false;
            this.imgFecha.VisibleChanged += new System.EventHandler(this.ImgDL_VisibleChanged);
            // 
            // imgDL
            // 
            this.imgDL.ImageLocation = "Images\\greenCheck.png";
            this.imgDL.Location = new System.Drawing.Point(891, 350);
            this.imgDL.Name = "imgDL";
            this.imgDL.Size = new System.Drawing.Size(56, 32);
            this.imgDL.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.imgDL.TabIndex = 25;
            this.imgDL.TabStop = false;
            this.imgDL.VisibleChanged += new System.EventHandler(this.ImgDL_VisibleChanged);
            // 
            // pictureBox1
            // 
            this.pictureBox1.ImageLocation = "Images\\Vass.png";
            this.pictureBox1.Location = new System.Drawing.Point(354, -71);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(254, 202);
            this.pictureBox1.TabIndex = 23;
            this.pictureBox1.TabStop = false;
            // 
            // label16
            // 
            this.label16.AutoSize = true;
            this.label16.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label16.Location = new System.Drawing.Point(581, 520);
            this.label16.Name = "label16";
            this.label16.Size = new System.Drawing.Size(48, 13);
            this.label16.TabIndex = 45;
            this.label16.Text = "label16";
            // 
            // progressBar1
            // 
            this.progressBar1.Location = new System.Drawing.Point(574, 536);
            this.progressBar1.Name = "progressBar1";
            this.progressBar1.Size = new System.Drawing.Size(283, 23);
            this.progressBar1.TabIndex = 46;
            // 
            // rdbNom
            // 
            this.rdbNom.AutoSize = true;
            this.rdbNom.Location = new System.Drawing.Point(622, 298);
            this.rdbNom.Name = "rdbNom";
            this.rdbNom.Size = new System.Drawing.Size(61, 17);
            this.rdbNom.TabIndex = 47;
            this.rdbNom.TabStop = true;
            this.rdbNom.Text = "Nómina";
            this.rdbNom.UseVisualStyleBackColor = true;
            // 
            // rdbCer
            // 
            this.rdbCer.AutoSize = true;
            this.rdbCer.Location = new System.Drawing.Point(689, 322);
            this.rdbCer.Name = "rdbCer";
            this.rdbCer.Size = new System.Drawing.Size(142, 17);
            this.rdbCer.TabIndex = 48;
            this.rdbCer.TabStop = true;
            this.rdbCer.Text = "Certificado de Retención";
            this.rdbCer.UseVisualStyleBackColor = true;
            // 
            // label17
            // 
            this.label17.AutoSize = true;
            this.label17.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label17.Location = new System.Drawing.Point(484, 319);
            this.label17.Name = "label17";
            this.label17.Size = new System.Drawing.Size(100, 13);
            this.label17.TabIndex = 49;
            this.label17.Text = "Tipo Documento";
            // 
            // imgDocType
            // 
            this.imgDocType.ImageLocation = "Images\\greenCheck.png";
            this.imgDocType.Location = new System.Drawing.Point(837, 298);
            this.imgDocType.Name = "imgDocType";
            this.imgDocType.Size = new System.Drawing.Size(57, 34);
            this.imgDocType.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.imgDocType.TabIndex = 50;
            this.imgDocType.TabStop = false;
            // 
            // rdb145
            // 
            this.rdb145.AutoSize = true;
            this.rdb145.Location = new System.Drawing.Point(689, 298);
            this.rdb145.Name = "rdb145";
            this.rdb145.Size = new System.Drawing.Size(67, 17);
            this.rdb145.TabIndex = 51;
            this.rdb145.TabStop = true;
            this.rdb145.Text = "Mod 145";
            this.rdb145.UseVisualStyleBackColor = true;
            // 
            // rdbExtra
            // 
            this.rdbExtra.AutoSize = true;
            this.rdbExtra.Location = new System.Drawing.Point(622, 321);
            this.rdbExtra.Name = "rdbExtra";
            this.rdbExtra.Size = new System.Drawing.Size(49, 17);
            this.rdbExtra.TabIndex = 52;
            this.rdbExtra.TabStop = true;
            this.rdbExtra.Text = "Extra";
            this.rdbExtra.UseVisualStyleBackColor = true;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.WhiteSmoke;
            this.ClientSize = new System.Drawing.Size(986, 596);
            this.Controls.Add(this.rdbExtra);
            this.Controls.Add(this.rdb145);
            this.Controls.Add(this.imgDocType);
            this.Controls.Add(this.label17);
            this.Controls.Add(this.rdbCer);
            this.Controls.Add(this.rdbNom);
            this.Controls.Add(this.progressBar1);
            this.Controls.Add(this.label16);
            this.Controls.Add(this.label15);
            this.Controls.Add(this.label14);
            this.Controls.Add(this.label13);
            this.Controls.Add(this.label12);
            this.Controls.Add(this.btnParticionar);
            this.Controls.Add(this.btnSaveMaster);
            this.Controls.Add(this.txbSavePDFMaster);
            this.Controls.Add(this.btnBrowseMaster);
            this.Controls.Add(this.label11);
            this.Controls.Add(this.txbPDFMaster);
            this.Controls.Add(this.label10);
            this.Controls.Add(this.label9);
            this.Controls.Add(this.imgSB);
            this.Controls.Add(this.imgFecha);
            this.Controls.Add(this.imgDL);
            this.Controls.Add(this.lblStatus);
            this.Controls.Add(this.pictureBox1);
            this.Controls.Add(this.lblTime);
            this.Controls.Add(this.dtNomina);
            this.Controls.Add(this.label8);
            this.Controls.Add(this.btnDisconnect);
            this.Controls.Add(this.btnClean);
            this.Controls.Add(this.btnCheck);
            this.Controls.Add(this.btnCopy);
            this.Controls.Add(this.btnConnect);
            this.Controls.Add(this.label6);
            this.Controls.Add(this.txbLocalDirectory);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.btnBrowse);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.txbSPLibrary);
            this.Controls.Add(this.txbSPSite);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.txbPass);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.txbUserName);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.label7);
            this.Font = new System.Drawing.Font("Microsoft Sans Serif", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.ForeColor = System.Drawing.SystemColors.ControlText;
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.Fixed3D;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.Name = "Form1";
            this.Text = "GRUPO VASS - 𝖱𝖱𝖧𝖧 - 𝖭ó𝗆𝗂𝗇𝖺𝗌";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.imgSB)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.imgFecha)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.imgDL)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.imgDocType)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox txbUserName;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox txbPass;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox txbSPSite;
        private System.Windows.Forms.TextBox txbSPLibrary;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Button btnBrowse;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox txbLocalDirectory;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Button btnConnect;
        private System.Windows.Forms.Button btnCopy;
        private System.Windows.Forms.Button btnCheck;
        private System.Windows.Forms.Button btnClean;
        private System.Windows.Forms.Button btnDisconnect;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.DateTimePicker dtNomina;
        private System.Windows.Forms.Label lblTime;
        private System.Windows.Forms.Timer timer1;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Label lblStatus;
        private System.Windows.Forms.PictureBox imgDL;
        private System.Windows.Forms.PictureBox imgFecha;
        private System.Windows.Forms.PictureBox imgSB;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.TextBox txbPDFMaster;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.Button btnBrowseMaster;
        private System.Windows.Forms.TextBox txbSavePDFMaster;
        private System.Windows.Forms.Button btnSaveMaster;
        private System.Windows.Forms.Button btnParticionar;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.Label label14;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.Label label16;
        private System.Windows.Forms.ProgressBar progressBar1;
        private System.Windows.Forms.RadioButton rdbNom;
        private System.Windows.Forms.RadioButton rdbCer;
        private System.Windows.Forms.Label label17;
        private System.Windows.Forms.PictureBox imgDocType;
        private System.Windows.Forms.RadioButton rdb145;
        private System.Windows.Forms.RadioButton rdbExtra;
    }
}

