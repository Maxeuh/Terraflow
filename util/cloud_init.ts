import {FieldType, TerraNode} from "@/util/types";

export class CloudInit extends TerraNode {

    public hostName : string = "hostname";
    public userName : string = "user";
    public userSudo : string = "ALL=(ALL) NOPASSWD:ALL";
    public userShell : string = "/bin/bash";
    public packageUpdate : boolean = false; 
    public packages : string = "";  // packages that will be installed
    public runcmd : string = "echo \"Cloud-init script executed on VM with hostname  ${hostname}\" \n hostnamectl set-hostname ${hostname}" ; // script that will run at the end of the cloud_init sequence 
    public finalMessage : string = "Cloud-init finished on VM ${hostname}.${domain}";



    constructor(name : string){
        super(name);
        this._varTypes = [
            {
                name: "hostName",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]$/,
                value: this.hostName,
                mandatory : true
            },
            {
                name: "userName",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]$/,
                value: this.userName,
                mandatory : false
            }, {
                name: "userSudo",
                type: FieldType.String,
                regex: /.*/,
                value: this.userSudo,
                mandatory : true 
            }, {
                name: "userShell",
                type: FieldType.String,
                regex: /.*/,
                value: this.userShell,
                mandatory : true 
            }, {
                name: "packageUpdate",
                type: FieldType.CheckBox,
                regex: /.*/,
                value: this.packageUpdate,
                mandatory : false
            }, {
                name: "packages",
                type: FieldType.String,
                regex: /^([a-zA-Z0-9_-]+\s*)(\s*,\s*[a-zA-Z0-9_-]+\s*)*$/,
                value: this.packages,
                mandatory : false 
            }, {
                name: "runcmd",
                type: FieldType.String,
                regex: /^([^\n\r]+(\r?\n)?)+$/,
                value: this.runcmd,
                mandatory : true
            },{
                name: "finalMessage",
                type: FieldType.String,
                regex: /^[a-zA-Z0-9._-]$/,
                value: this.finalMessage,
                mandatory : true 
            }
        ]
    }

    


    setHostname( hostname : string) {
        this.hostName = hostname; 
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
        this.packageUpdate = update;
    }
    setPackages(packages : string){
        this.packages = packages;
    }

    setRuncmd(runcmd : string){
        this.runcmd = runcmd;
    }

    setFinalMessage(final_message : string){
        this.finalMessage = final_message; 
    }


    generateConfigNode(): string {
        let file_content  = `hostname: "${this.hostName}"
        
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
         
package_update : ${this.packageUpdate}
`;
        const packagestab = this.packages.split(",");
        if(this.packages && this.packages.length > 0) {
            for(let pack of packagestab){
                file_content+=` -${pack}\n`;
            }
        }

        file_content+=`\nruncmd:\n` 
        const commandlist = this.runcmd.split("\n")
        for(let runcmd of commandlist){
            file_content+=` - ${runcmd}\n`;
        }

        file_content+=`\nfinal_message : "${this.finalMessage}";

        `
       return file_content
         

    }

}