import {FieldType, TerraNode} from "@/util/types";


/*class Write_File {
    public path : string  = "";
    public content :string ="";
    public permissions : string = "" ;

    setPath(path : string){
        this.path = path;

    }
    setContent(content: string){
        this.content = content;
    }
    setPermission(permission : string){
        this.permissions = permission;
    }
}*/



export class CloudInit extends TerraNode {

    public hostname : string = "hostname";
    public userName : string = "user";
    public userSudo : string = "ALL=(ALL) NOPASSWD:ALL";
    public userShell : string = "/bin/bash";
    public package_update : boolean = false; 
    public packages : string = "";  // packages that will be installed
    //public write_files : Write_File[] = [];
    public runcmd : string = "echo \"Cloud-init script executed on VM with hostname  ${hostname}\" \n hostnamectl set-hostname ${hostname}" ; // script that will run at the end of the cloud_init sequence 
    public final_message : string = "Cloud-init finished on VM ${hostname}.${domain}";



    constructor(){
        super();
        this._varTypes = [
            {
                name: "hostname",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]$/,
                value: this.hostname
            },
            {
                name: "username",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]$/,
                value: this.userName
            }, {
                name: "sudo",
                type: FieldType.String,
                regex: /.*/,
                value: this.userSudo
            }, {
                name: "shell",
                type: FieldType.String,
                regex: /.*/,
                value: this.userShell
            }, {
                name: "package update",
                type: FieldType.CheckBox,
                regex: /.*/,
                value: this.package_update
            }, {
                name: "packages",
                type: FieldType.String,
                regex: /^([a-zA-Z0-9_-]+\s*)(\s*,\s*[a-zA-Z0-9_-]+\s*)*$/,
                value: this.packages
            }, {
                name: "script",
                type: FieldType.String,
                regex: /^([^\n\r]+(\r?\n)?)+$/,
                value: this.runcmd
            },{
                name: "message final",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]$/,
                value: this.runcmd
            }
        ]
    }

    


    setHostname( hostname : string) {
        this.hostname = hostname; 
    }

    setUserName(user : string){
        this.userName = user;
    }
    setUserSudo(sudo : string){
        this.userSudo = sudo;
    }
    setUserShell(shell : string){
        this.userShell = shell;
    }
    setPackageUpdate(update : boolean){
        this.package_update = update;
    }
    setPackages(packages : string){
        this.packages = packages;
    }
   /* setWriteFiles(write_files : Write_File[]){
        this.write_files = write_files;
    }*/
    setRuncmd(runcmd : string){
        this.runcmd = runcmd;
    }

    setFinalMessage(final_message : string){
        this.final_message = final_message; 
    }


    generateConfigNode(): string {
        let file_content  = `hostname: "${this.hostname}"
        
manage_etc_hosts : true 
network : 
    version: 2
    eternets : 
        eth0:
            dhcp4:true 
        
users :
    - name: ${this.userName}
     sudo : ${this.userSudo}
     shell: ${this.userShell}
         
package_update : ${this.package_update}
`;
        const packagestab = this.packages.split(",");
        if(this.packages && this.packages.length > 0) {
            for(let pack of packagestab){
                file_content+=` -${pack}\n`;
            }
        }
        /*if(this.write_files && this.write_files.length > 0) {
            file_content += `write_files:\n`;

             for(let write_file of this.write_files){
                file_content+=` -path : ${write_file.path}\n`;
                file_content+=` content : ${write_file.content}\n`;
                file_content+=` permissions: '${write_file.permissions}'\n`;
            
            }
        }*/
        file_content+=`\nruncmd:\n` 
        const commandlist = this.runcmd.split("\n")
        for(let runcmd of commandlist){
            file_content+=` - ${runcmd}\n`;
        }

        file_content+=`\nfinal_message : "${this.final_message}";

        `
       return file_content
         

    }

}