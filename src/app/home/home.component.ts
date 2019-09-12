import { Component, OnInit, ɵConsole, Inject } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
import { ServiceService } from '../service/dashboard/service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from '../service/notification/notification.service';
import { NzMessageService } from 'ng-zorro-antd';
import { DistrictService } from '../service/district/district.service';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { FocusTrap } from '@angular/cdk/a11y';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  selectedPty1Name = '';
  selectedPty2Name = '';
  selectedPty3Name = '';
  selectedPty1Id;
  selectedPty2Id;
  selectedPty3Id;

  Party1Data=[];
  Party2Data=[];
  Party3Data=[];

  listOfProv: Array<{ label: string; value: string }> = [];
  listOfReg: Array<{ label: string; value: string }> = [];
  listOfNumdist: Array<{ label: string; value: string }> = [];
  listOfParty= [];
  listOfColor=["#35B7E7","#3E61A7","#182750","#EB2390","#E01E2C","#F36E23","#FBCF00","#A41D22","#8E837B","#688EC3","#9C5325","#3EA647","#035C4E"];
  showCreateDistrict=true;
  singleValueFullname;
  Reg_Prov = 'Province'; 
  singleValueProv;
  singleValueReg; 
  isSingleValueRegNull = true;
  isDistrictFull = false;
  regionList=[];
  provinceList=[];
  //form_create_district
  values: any[] | null = null;
  formVisible = false;
  isOfficer = false;
    //PtyName
      // Pty1Name;
      // Pty2Name;
      // Pty3Name;
    //PtyVote
      Pty1Vote = 3000;
      Pty2Vote = 2000;
      Pty3Vote = 1000;
    //set percent
      //BadVote
      BadVoteValue = 0;
      BadVoteformatterPercent = (value: number) => `${value} %`;
      BadVoteparserPercent = (value: string) => value.replace(' %', '');
      //VoteNo
      VoteNoValue = 0;
      VoteNoformatterPercent = (value: number) => `${value} %`;
      VoteNoparserPercent = (value: string) => value.replace(' %', '');

  //District
  provinceId : number;
  listOfDistrict=[];
  //Down
  listOfData: Array<{ pty1_Name: string; pty2_Name: string,pty3_Name: string;
                    pty1Vote: string;pty2Vote: string;pty3Vote: string; 
                    pty1_Logo: string;pty2_Logo: string;pty3_Logo: string;}> = [];
  listOfData2: Array<{ ptyName: string; logo: string,mHR: string;}> = [];
  listOfSummary: Array<{ ptyName: string; logo: string,mHR: string;}> = [];
  listOfNotApprove: Array<{ notApprovedDistrictList: string;}> = [];

  //SendPrvID
  getPrvID() {
    console.log(this.singleValueProv)
    this.getElectionPartyDistricts(""+this.storage.get("userId"),this.singleValueProv.id)
    this.getSummary(""+this.storage.get("userId"),this.singleValueProv.id)
    console.log("getPrvID")
    console.log(this.singleValueProv.id)
  }
  getRgnID() {
    console.log(this.singleValueReg)
    this.getElectionPartyRegion(""+this.storage.get("userId"),this.singleValueReg.id)
  }
  //createDistrict
  createDistrict(): void {
    this.formVisible = true;
  }
  handleCreateOk($event: MouseEvent): void {
    console.log('Button ok clicked!', this.values, $event);
    this.selectedPty1Id = this.listOfParty.indexOf(this.selectedPty1Name)+1
    this.selectedPty2Id = this.listOfParty.indexOf(this.selectedPty2Name)+1
    this.selectedPty3Id = this.listOfParty.indexOf(this.selectedPty3Name)+1

    if(this.singleValueFullname == ''){
      this.nzMessageService.create('error','error to create form numdist can not null!');
    }
    else if(this.selectedPty1Name == '' || this.selectedPty2Name == '' || this.selectedPty3Name == '' ){
      this.nzMessageService.create('error','error to create form name can not null!');
    }
    else if(this.selectedPty1Name == this.selectedPty2Name || this.selectedPty2Name == this.selectedPty3Name ||this.selectedPty1Name == this.selectedPty3Name){
      this.nzMessageService.create('error','error to create form name can not equals!');
    }
    else if(this.Pty1Vote == this.Pty2Vote || this.Pty2Vote == this.Pty3Vote || this.Pty1Vote == this.Pty3Vote){
      this.nzMessageService.create('error','error to create form vote can not equals!');

    }else{
    this.postCreateElectionDistinct("2",this.storage.get("position"),this.singleValueProv.id,this.singleValueFullname,this.selectedPty1Id,this.Pty1Vote,this.selectedPty2Id,this.Pty2Vote,this.selectedPty3Id,this.Pty3Vote,this.BadVoteValue,this.VoteNoValue)
    this.nzMessageService.create('success','Create Ok!');
    this.formVisible = false;
    }
  }

  handleCreateCancel($event: MouseEvent): void {
    console.log('Button cancel clicked!', $event);
    this.nzMessageService.info('Cancel');
    this.formVisible = false;
  }

  //Feed
  listOfFeed= [];
  ShowProvinceList = true;
  ChangeToProv(): void {
    this.ShowProvinceList = true;
  }
  ChangeToReg(): void {
    this.ShowProvinceList = false;
  }
  // show information
  isVisible = localStorage.getItem('isVisible') === 'true' ? true : false;
  // showModal(): void {
  //   this.isVisible = true;
  // }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    localStorage.setItem('isVisible','false');
    this.isVisible = localStorage.getItem('isVisible') === 'true' ? true : false;
  }
  //Change position
  changePosn() {
    if(this.storage.get("position") == "Officer")
      this.isOfficer = true
    else {
      this.isOfficer = false
    }
  }

  //API
  posts:Object;
  constructor(private serviceService:ServiceService,private _sanitizer: DomSanitizer,
    private notificationService:NotificationService,private nzMessageService: NzMessageService,
    public local: LocalStorageService, public session: SessionStorageService,
    private districtService:DistrictService,
    @Inject(SESSION_STORAGE) private storage: WebStorageService ) { }

  //Summary of Province
  getSummary(userId,provinceId) {
    this.serviceService.getSummaryElectionPartyDistricts(userId,provinceId).then(data => { 
      console.log("getSummary")
      console.log(data)
      this.listOfSummary = data.summaryElectionPartyDistrictsList
      this.getGraph();
    })
  }
  getGraph() {
    // console.log("getGraph")
    // console.log(this.listOfSummary[0]['ptyID'])
    // console.log(this.listOfColor)
    // console.log(this.listOfColor[(this.listOfSummary[0])-1])
      // let ptyName = this.listOfSummary[0].ptyName;
      if(this.listOfSummary.length == 1 ){
        CanvasJS.addColorSet("greenShades",
              [//colorSet Array
              this.listOfColor[this.listOfSummary[0]['ptyID']-1],        
              ]); 
          let chart = new CanvasJS.Chart("chartContainer", {
            colorSet: "greenShades",
            animationEnabled: true,
            exportEnabled: true,
            title: {
              text: "Party List ",
              fontFamily: "sans-serif"
            },
            data: [{
              type: "column",
              dataPoints: [
                { y: this.listOfSummary[0].mHR, label: this.listOfSummary[0].ptyName },
              ]
            }]
          });
        chart.render();
      }else if(this.listOfSummary.length == 2 ){
        CanvasJS.addColorSet("greenShades",
              [//colorSet Array

              this.listOfColor[this.listOfSummary[0]['ptyID']-1],
              this.listOfColor[this.listOfSummary[1]['ptyID']-1],         
              ]); 
        let chart = new CanvasJS.Chart("chartContainer", {
          colorSet: "greenShades",
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: "Party List ",
            fontFamily: "sans-serif"
          },
          data: [{
            type: "column",
            dataPoints: [
              { y: this.listOfSummary[0].mHR, label: this.listOfSummary[0].ptyName },
              { y: this.listOfSummary[1].mHR, label: this.listOfSummary[1].ptyName },
            ]
          }]
        });
      chart.render();
    }else if(this.listOfSummary.length == 3 ) {
      CanvasJS.addColorSet("greenShades",
              [//colorSet Array

              this.listOfColor[this.listOfSummary[0]['ptyID']-1],
              this.listOfColor[this.listOfSummary[1]['ptyID']-1],
              this.listOfColor[this.listOfSummary[2]['ptyID']-1],         
              ]); 
      let chart = new CanvasJS.Chart("chartContainer", {
        colorSet: "greenShades",
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Party List ",
          fontFamily: "sans-serif"
        },
        data: [{
          type: "column",
          dataPoints: [
            { y: this.listOfSummary[0].mHR, label: this.listOfSummary[0].ptyName },
            { y: this.listOfSummary[1].mHR, label: this.listOfSummary[1].ptyName },
            { y: this.listOfSummary[2].mHR, label: this.listOfSummary[2].ptyName },
          ]
        }]
      });
    chart.render();
    }else if(this.listOfSummary.length == 0){
      CanvasJS.addColorSet("greenShades",
              [//colorSet Array
              "#BDEEFF"      
              ]); 
      let chart = new CanvasJS.Chart("chartContainer", {
        colorSet: "greenShades",
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Party List ",
          fontFamily: "sans-serif"
        },
        data: [{
          type: "column",
          dataPoints: [
            { y: '0', label: 'No Data' },
          ]
        }]
      });
      chart.render();
    }else{
      CanvasJS.addColorSet("greenShades",
              [//colorSet Array

              this.listOfColor[this.listOfSummary[0]['ptyID']-1],
              this.listOfColor[this.listOfSummary[1]['ptyID']-1],
              this.listOfColor[this.listOfSummary[2]['ptyID']-1],        
              ]); 
      let chart = new CanvasJS.Chart("chartContainer", {
        colorSet: "greenShades",
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Party List ",
          fontFamily: "sans-serif"
        },
        data: [{
          type: "column",
          dataPoints: [
            { y: this.listOfSummary[0].mHR, label: this.listOfSummary[0].ptyName },
            { y: this.listOfSummary[1].mHR, label: this.listOfSummary[1].ptyName },
            { y: this.listOfSummary[2].mHR, label: this.listOfSummary[2].ptyName },
          ]
        }]
      });
      chart.render();
    }
  }
  //list ตาม data ที่ถูกเลือก
  getElectionPartyDistricts(userId,provinceId){
    this.serviceService.getElectionPartyDistricts(userId,provinceId).then(data => { 
      this.listOfData = data.electionPartyDistrictsList;
      for (let data of this.listOfData) {
        console.log("ListOfData")
        console.log(data)
      }
      this.getNotApprovedDistrictsByProvince(provinceId);
    })
  }
  getElectionPartyRegion(userId,regionId){
    this.serviceService.getElectionPartyRegion(userId,regionId).then(data => { 
      this.listOfData2 = data.electionPartyRegionList;
      this.listOfSummary = this.listOfData2
      for (let data of this.listOfData2) {
        console.log("ListOfData2")
        console.log(data)
      }
      this.getGraph();
    })
    this.isSingleValueRegNull =false
  }
  getFeedNotifications(){
      this.notificationService.getFeedNotifications(this.storage.get("userId"),this.storage.get("position"),this.storage.get("username")).then(data => { 
        this.listOfFeed = data.notifications;
        this.listOfFeed.splice(5)
        // for(let data of this.listOfFeed ){
        //   let array = data.msg.split(",")
        //   data.msg = array[0]
        // }
      })
  }
  getNotApprovedDistrictsByProvince(provinceId) {
    const childrenOfNumDist: Array<{ label: string; value: string }> = [];
    
    this.serviceService.getNotApprovedDistrictsByProvince(provinceId).then(data => {
      this.listOfNotApprove = data.notApprovedDistrictList;
      if(this.listOfNotApprove.length == 0){
        this.isDistrictFull = true;
      }
      for (let province of this.listOfNotApprove) {
        childrenOfNumDist.push({ label: ""+province, value: ""+province });
      }
      this.listOfNumdist = childrenOfNumDist;
      if(this.listOfNumdist.length == 0){
        this.showCreateDistrict = false;
      }else{
        this.showCreateDistrict = true;
      }
      this.singleValueFullname = this.listOfNumdist[0].value
    })
  }

  getAllParty() {
    const childrenOfParty = [];
    const childrenOfParty1 = [];
    const childrenOfParty2 = [];
    const childrenOfParty3 = [];
    this.serviceService.getAllParty(this.storage.get("userId"),this.storage.get("position")).then(data => {
      this.listOfParty = data.partyList
      for (let party of this.listOfParty) {
        childrenOfParty.push(party.ptyName);
        childrenOfParty1.push(party.ptyName);
        childrenOfParty2.push(party.ptyName);
        childrenOfParty3.push(party.ptyName);
      }
      this.listOfParty = childrenOfParty
      this.Party1Data = childrenOfParty1
      this.Party2Data = childrenOfParty2
      this.Party3Data = childrenOfParty3
    })
  }
  postCreateElectionDistinct(userId,posn,prvId,distNum,pty1Id,pty1Vote,pty2Id,pty2Vote,pty3Id,pty3Vote,badVote,VoteNo) {
    this.districtService.postCreateElectionDistinct(userId,posn,prvId,distNum,pty1Id,pty1Vote,pty2Id,pty2Vote,pty3Id,pty3Vote,badVote,VoteNo).then(data => {
      console.log("In postCreateElectionDistinct")
      console.log("5555555555555555555555555555555")
      console.log(data)
    })
  }
  //OK
  postRequestToModifiedElectionResult(distID) {
    this.districtService.postRequestToModifiedElectionResult(""+this.storage.get("userId"),""+distID).then(data => {
      console.log("OK")
      console.log(this.storage.get("userId"))
      console.log(data)
      this.getPrvID()
    })
  }
   //LOGIC CHANGE DROPDOWN PtyName
   Pty1Change(): void {
    this.Party2Data.splice(0)
    for(let data of this.listOfParty){
      this.Party2Data.push(data)
    }
    var index = this.Party2Data.indexOf(this.selectedPty1Name)
    if (index > -1) {
      this.Party2Data.splice(index, 1);
    }
    index = this.Party2Data.indexOf(this.selectedPty3Name)
    if (index > -1) {
      this.Party2Data.splice(index, 1);
    }
    //party3
    this.Party3Data.splice(0)
    for(let data of this.listOfParty){
      this.Party3Data.push(data)
    }
    index = this.Party3Data.indexOf(this.selectedPty1Name)
    if (index > -1) {
      this.Party3Data.splice(index, 1);
    }
    index = this.Party3Data.indexOf(this.selectedPty2Name)
    if (index > -1) {
      this.Party3Data.splice(index, 1);
    }
  }

  Pty2Change(): void {
    console.log(this.listOfParty)
    //Party1
    this.Party1Data.splice(0)
    for(let data of this.listOfParty){
      this.Party1Data.push(data)
    }
    var index = this.Party1Data.indexOf(this.selectedPty2Name)
    if (index > -1) {
      this.Party1Data.splice(index, 1);
    }
    index = this.Party1Data.indexOf(this.selectedPty3Name)
    if (index > -1) {
      this.Party1Data.splice(index, 1);
    }
    //party3
    this.Party3Data.splice(0)
    for(let data of this.listOfParty){
      this.Party3Data.push(data)
    }
    index = this.Party3Data.indexOf(this.selectedPty1Name)
    if (index > -1) {
      this.Party3Data.splice(index, 1);
    }
    index = this.Party3Data.indexOf(this.selectedPty2Name)
    if (index > -1) {
      this.Party3Data.splice(index, 1);
    }
  }

  Pty3Change(): void {
    console.log(this.listOfParty)
    //Party1
    this.Party1Data.splice(0)
    for(let data of this.listOfParty){
      this.Party1Data.push(data)
    }
    var index = this.Party1Data.indexOf(this.selectedPty2Name)
    if (index > -1) {
      this.Party1Data.splice(index, 1);
    }
    index = this.Party1Data.indexOf(this.selectedPty3Name)
    if (index > -1) {
      this.Party1Data.splice(index, 1);
    }
    //party2
    this.Party2Data.splice(0)
    for(let data of this.listOfParty){
      this.Party2Data.push(data)
    }
    index = this.Party2Data.indexOf(this.selectedPty1Name)
    if (index > -1) {
      this.Party2Data.splice(index, 1);
    }
    index = this.Party2Data.indexOf(this.selectedPty3Name)
    if (index > -1) {
      this.Party2Data.splice(index, 1);
    }
  }
  //LOGIC PtyVote
  CheckPty1Vote(value) {
    if(value <= this.getPty2Vote())
      this.setPty2Vote(value)
    if(value <= this.getPty3Vote())
      this.setPty3Vote(value)
  }
  CheckPty2Vote(value) {
    if(value >= this.getPty1Vote())
      this.setPty1Vote(value)
    if(value <= this.getPty3Vote())
      this.setPty3Vote(value)
  }
  CheckPty3Vote(value) {
    if(value >= this.getPty1Vote())
      this.setPty1Vote(value)
    if(value >= this.getPty2Vote())
      this.setPty2Vote(value)
  }
  getPty1Vote(): number {
    let a = this.Pty1Vote
    return a
  }
  getPty2Vote(): number {
    let a = this.Pty2Vote
    return a
  }
  getPty3Vote(): number {
    let a = this.Pty3Vote
    return a
  }
  setPty1Vote(value : number): void {
    this.Pty1Vote = value 
  }
  setPty2Vote(value : number): void {
    this.Pty2Vote = value 
  }
  setPty3Vote(value : number): void {
    this.Pty3Vote = value 
  }
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }

  confirm(distID): void {
    this.nzMessageService.create('success','click confirm');
    this.postRequestToModifiedElectionResult(distID)
    
  }
  
  ngOnInit() {
    const childrenOfProv: Array<{ label: string; value: string; id:string }> = [];
    const childrenOfReg: Array<{ label: string; value: string; id:string }> = [];

    this.changePosn();
    this.provinceId = 1;
    this.getSummary(""+this.storage.get("userId"),'41');                     //Bangkok
    this.getElectionPartyDistricts(""+this.storage.get("userId"),'41');      //Bangkok
    this.getElectionPartyRegion(""+this.storage.get("userId"),'5');         //Bangkok
    this.getFeedNotifications();
    this.getNotApprovedDistrictsByProvince('1');
    this.getAllParty();
    //getAllProvince
    this.serviceService.getProvince().then(data => { // 200, completely
      this.provinceList=data.provinceList;
      for (let province of this.provinceList) {
        childrenOfProv.push({ label: province.prvName, value: province.prvName, id:province.prvID });
      }
      this.listOfProv=childrenOfProv;
    }).catch(err =>{
      console.log(err)
    })
    //getAllRegion
    this.serviceService.getRegion().then(data => { // 200, completely
      this.regionList=data.regionList;
      for (let region of this.regionList) {
        childrenOfReg.push({ label: region.rgnName, value: region.rgnName, id:region.rgnID });
      }
      this.listOfReg=childrenOfReg;
    }).catch(err =>{
      console.log(err)
    })

      
  }


}
