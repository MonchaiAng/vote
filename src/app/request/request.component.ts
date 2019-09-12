import { Component, OnInit, Inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { CenterService } from '../service/center/center.service';
import { DistrictService } from '../service/district/district.service';
import { ServiceService } from '../service/dashboard/service.service';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  request = 'Information';
  isOfficer=false;
  formEditVisible=false;
  //Start Mocks PtyData and PtyVote POPUP OFFICER
    NumDist = '';
    selectedPty1Name = '';
    selectedPty2Name = '';
    selectedPty3Name = '';
    selectedPty1Id;
    selectedPty2Id;
    selectedPty3Id;

    Party1Data=[];
    Party2Data=[];
    Party3Data=[];

    //PtyVote
    Pty1Vote;
    Pty2Vote;
    Pty3Vote;
    
    values: any[] | null = null;
    listOfNumdist: Array<{ label: string; value: string }> = [];
    listOfParty= [];
    listOfResultRequestedModifications= [];
    singleValueFullname;
    //set percent
      //BadVote
      BadVoteValue;
      BadVoteformatterPercent = (value: number) => `${value} %`;
      BadVoteparserPercent = (value: string) => value.replace(' %', '');
      //VoteNo
      VoteNoValue;
      VoteNoformatterPercent = (value: number) => `${value} %`;
      VoteNoparserPercent = (value: string) => value.replace(' %', '');

  //End Mocks PtyData and PtyVote

  provinceEdit;
  gridStyle = {
    textAlign: 'center',
    padding: '10px'
  };
  ShowInformationList = true;
  controlArray: any[] = [];
  listOfRequestedConfirmations= [];
  listOfRequestedModifications= [];
  // districtId: String='601';
  // isApproved: String='true';
  userId='2';

  DataWaitingEdit=[];
  // START FORM EDIT POPUP OFFICER
    showEditForm(distID,prvName) {
      this.formEditVisible = true;
      this.getElectionDistricts(distID);
      this.provinceEdit = prvName
    }
    ComfirmEditOk($event: MouseEvent): void {
      console.log('Button ok clicked!', this.values, $event);
      this.selectedPty1Id = this.listOfParty.indexOf(this.selectedPty1Name)+1
      this.selectedPty2Id = this.listOfParty.indexOf(this.selectedPty2Name)+1
      this.selectedPty3Id = this.listOfParty.indexOf(this.selectedPty3Name)+1
      //validate
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
        this.districtService.postUpdateElectionDistrict("2",this.DataWaitingEdit['prvID'],this.NumDist,this.selectedPty1Id,this.Pty1Vote,this.selectedPty2Id,this.Pty2Vote,this.selectedPty3Id,this.Pty3Vote,this.BadVoteValue,this.VoteNoValue).then(data =>{
          this.getResultRequestedModifications()
        })
        this.nzMessageService.create('success','Edit Ok!');
        this.formEditVisible = false;
      }
      console.log("Test")
      console.log(""+this.DataWaitingEdit['prvID'])
      console.log(""+this.NumDist)
      console.log(""+this.selectedPty1Id)
      console.log(""+this.selectedPty2Id)
      console.log(""+this.selectedPty3Id)
      console.log(""+this.Pty1Vote)
      console.log(""+this.Pty2Vote)
      console.log(""+this.Pty3Vote)
      console.log(""+this.BadVoteValue)
      console.log(""+this.VoteNoValue)
    }
    handleEditCancel($event: MouseEvent): void {
      console.log('Button cancel clicked!', $event);
      this.nzMessageService.info('Cancel');
      this.formEditVisible = false;
    }
  //END FORM EDIT 
  UpdateList(): void {
    this.ShowInformationList = false;
  }
  InformationList(): void {
    this.ShowInformationList = true;
  }
  cancel(): void {
    this.nzMessageService.info('Cancel');
  }

  confirm(distID): void {
    this.nzMessageService.create('success','Completely approved!');
    this.postReplyRequestedConfirmation(distID[0],"true",this.userId);
  }
  
  confirmModifications(distID): void {
    console.log(distID)
    this.nzMessageService.create('success','Completely approved!');
    this.postReplyRequestedModification(distID[0],"true",this.userId);
    
  }

  reject(distID): void {
    this.nzMessageService.create('success','Completely rejected!');
    this.postReplyRequestedConfirmation(distID[0],"false",this.userId);
  }

  rejectModifications(distID): void {
    console.log(distID)
    this.nzMessageService.create('success','Completely rejected!');
    this.postReplyRequestedModification(distID[0],"false",this.userId);
  }
  changePosn() {
    if(this.storage.get("position") == "Officer")
      this.isOfficer = true
    else {
      this.isOfficer = false
    }
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
    console.log("Party1Data")
    console.log(this.Party1Data)
    console.log(this.Party2Data)
    console.log(this.Party3Data)
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

  constructor(private nzMessageService: NzMessageService, private centerService: CenterService,
    private districtService:DistrictService,private serviceService:ServiceService,
    @Inject(SESSION_STORAGE) private storage: WebStorageService) { }
  // API
  //Center
  getRequestedConfirmations() {
    this.centerService.getRequestedConfirmations(this.storage.get("userId")).then(data => { 
        this.listOfRequestedConfirmations = data.listRequestCon;
        console.log("getRequestedConfirmations")
        console.log(this.listOfRequestedConfirmations)
      }).catch(err =>{
        console.log(err)
      })
  }

  getRequestedModifications() {
    this.centerService.getRequestedModifications(this.storage.get("userId")).then(data => { 
      console.log("getRequestedModifications")
        this.listOfRequestedModifications = data.listRequestModi;
        console.log(this.listOfRequestedModifications)
      }).catch(err =>{
        console.log(err)
      })
  }

  postReplyRequestedConfirmation(districtId,isApproved,userId) {
    this.centerService.postReplyRequestedConfirmation(districtId,isApproved,userId).subscribe(data => {
        console.log(data)
        this.getRequestedConfirmations();
      })
  }

  postReplyRequestedModification(districtId,isApproved,userId) {
    this.centerService.postReplyRequestedModification(districtId,isApproved,userId).subscribe(data => {
        console.log(data)
        this.getRequestedModifications()
      })
  }
  //Officer
  getResultRequestedModifications() {
    this.districtService.getResultRequestedModifications().then(data => {
      this.listOfResultRequestedModifications = data.voteList
      console.log(this.listOfResultRequestedModifications)
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
  getElectionDistricts(distID) {
    this.districtService.getElectionDistricts(distID).then(data => {
      this.DataWaitingEdit = data.getElectionPartyDistrictsModel
      //รอเพิ่มชื่อ
      console.log("getElectionDistricts")
      console.log(this.DataWaitingEdit)
      this.NumDist = this.DataWaitingEdit['distNum'];
      this.selectedPty1Name = this.DataWaitingEdit['pty1_Name'];
      this.selectedPty2Name = this.DataWaitingEdit['pty2_Name'];
      this.selectedPty3Name = this.DataWaitingEdit['pty3_Name'];
      this.Pty1Vote = this.DataWaitingEdit['pty1Vote'];
      this.Pty2Vote = this.DataWaitingEdit['pty2Vote'];
      this.Pty3Vote = this.DataWaitingEdit['pty3Vote'];
      this.BadVoteValue = this.DataWaitingEdit['badVote'];
      this.VoteNoValue = this.DataWaitingEdit['voteNo'];
    })
  }
  //detailUpdate
  showDetail=false;
  prvName;
  distNum;
  detail;
  party1;
  party2;
  party3;
  vote1;
  vote2;
  vote3;
  badvote;
  voteno;
  detailUpdate(distID){
    for(let data of this.listOfRequestedModifications){
      if(data.distID == distID){
        this.showDetail=true;
        this.prvName=data.prvName
        this.distNum=data.distNum
        this.party1 = data.pty1_Name
        this.party2 = data.pty2_Name
        this.party3 = data.pty3_Name
        this.vote1 = data.pty1Vote
        this.vote2 = data.pty2Vote
        this.vote3 = data.pty3Vote
        this.badvote = data.badVote
        this.voteno = data.voteNo
      }
    }
  }
  clickClose($event: MouseEvent){
    console.log('Button cancel clicked!', $event);
    this.nzMessageService.info('close');
    this.showDetail = false;
  }
  ngOnInit(): void {
    this.getRequestedConfirmations();
    this.getRequestedModifications();
    this.changePosn();

    this.getResultRequestedModifications();
    this.getAllParty();
    const childrenOfNumDist: Array<{ label: string; value: string }> = [];
    console.log("Test")
     //Mockup Form CrateDistrict
      //add NumDist
      // childrenOfNumDist.push({ label: '1', value: '1' });
      // childrenOfNumDist.push({ label: '2', value: '2' });
      // childrenOfNumDist.push({ label: '11', value: '11' });
      // childrenOfNumDist.push({ label: '16', value: '16' });
      // childrenOfNumDist.push({ label: '20', value: '20' });
      // this.listOfNumdist = childrenOfNumDist;
      // this.singleValueFullname = this.listOfNumdist[0].value
      
  }

}
