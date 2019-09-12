import { Component, OnInit, Inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { NotificationService } from '../service/notification/notification.service';
import { AuthService } from '../service/auth/auth.service';
import { WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { DistrictService } from '../service/district/district.service';

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
            isLeaf: true
          }
        ]
      },
      {
        value: 'ningbo',
        label: 'Ningbo',
        isLeaf: true
      }
    ]
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
            isLeaf: true
          }
        ]
      }
    ]
  }
];
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})

export class NewsComponent implements OnInit {
  singleValuePosition = 'Position';
  singleValueFullname = 'Fullname';
  // true == Center , false == Officer
  CheckPosition = true;

  radioValue = 'Center';
  // modal dialog
  
  nzOptions = options;
  values: any[] | null = null;
  isVisible = false;
  listOfPosn2 = [];
  listOfPosn: Array<{ label: string; value: string }> = [];
  listOfFull: Array<{ label: string; value: string }> = [];
  isOfficer=false;
  // modal dialog
  onChanges(values: any): void {
    console.log(values, this.values);
  }

  open(): void {
    this.isVisible = true;
  }

  handleOk($event: MouseEvent): void {
    console.log('Button ok clicked!', this.values, $event);
    this.nzMessageService.create('success','Create Ok!');
    this.isVisible = false;
  }

  handleCancel($event: MouseEvent): void {
    console.log('Button cancel clicked!', $event);
    this.nzMessageService.info('Cancel');
    this.isVisible = false;
  }
  clickClose($event: MouseEvent){
    console.log('Button cancel clicked!', $event);
    this.nzMessageService.info('close');
    this.formEditVisible = false;
  }
  changePosn() {
    if(this.storage.get("position") == "Officer")
      this.isOfficer = true
    else {
      this.isOfficer = false
    }
  }
  

  constructor(private nzMessageService: NzMessageService,private notificationService:NotificationService,
    @Inject(SESSION_STORAGE) private storage: WebStorageService,private districtService:DistrictService ) { }
  //API
  getFeedNotifications(){
    this.notificationService.getFeedNotifications(this.storage.get("userId"),this.storage.get("position"),this.storage.get("username")).then(data => { 
      this.listOfPosn2 = data.notifications;
      console.log("Test getFeedNotifications()")
      for (let data of this.listOfPosn2) {
        console.log(data)
      }
    })
  }
  //link
  party1;
  party2;
  party3;
  vote1;
  vote2;
  vote3;
  badvote;
  voteno;
  formEditVisible=false;
  creDTM;
  listOfNoti;
  showEditForm(distID,creDTM) {
    this.creDTM = creDTM
    this.getElectionDistricts(distID);
    this.formEditVisible = true;
  }
  getElectionDistricts(distID) {
    this.districtService.getElectionDistricts(distID).then(data => {
      console.log(12312323)
      this.listOfNoti = data.getElectionPartyDistrictsModel
      console.log(this.listOfNoti)
      this.party1 = this.listOfNoti.pty1_Name
      this.party2 = this.listOfNoti.pty2_Name
      this.party3 = this.listOfNoti.pty3_Name
      this.vote1 = this.listOfNoti.pty1Vote
      this.vote2 = this.listOfNoti.pty2Vote
      this.vote3 = this.listOfNoti.pty3Vote
      this.badvote = this.listOfNoti.badVote
      this.voteno = this.listOfNoti.voteNo
      //รอเพิ่มชื่อ
    })
  }
  ngOnInit() {
    const childrenOfPosn: Array<{ label: string; value: string }> = [];
    const childrenOfFullname: Array<{ label: string; value: string }> = [];
    this.getFeedNotifications();
    childrenOfPosn.push({ label: 'Center', value: 'Center' });
    childrenOfPosn.push({ label: 'Officer', value: 'Officer' });
    this.listOfPosn = childrenOfPosn;
    this.changePosn();
    childrenOfFullname.push({ label: 'Por', value: 'Por' });
    childrenOfFullname.push({ label: 'Tarn', value: 'Tarn' });
    this.listOfFull = childrenOfFullname;
  }

}
