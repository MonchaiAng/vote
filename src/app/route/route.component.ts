import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService, NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {
  confirmModal: NzModalRef;
  constructor(public router: Router,private modal: NzModalService) { }
  // logout(){
  //   localStorage.setItem('loggedIn','false');
  //   this.router.navigate(['signin']);
  // }
  logout(): void {
    setTimeout(()=>this.modal.closeAll(), 5000);
    this.confirmModal = this.modal.confirm({
      nzTitle: 'Do you Want to Logout?',
      nzContent: 'This dialog will be closed after 5 second',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          localStorage.setItem('loggedIn','false');
          this.router.navigate(['signin']);
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
  ngOnInit() {
  }

}
