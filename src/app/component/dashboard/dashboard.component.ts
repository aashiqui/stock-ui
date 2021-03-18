import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label, Color, BaseChartDirective } from 'ng2-charts';
import { TokenStorageService } from 'src/app/service/token-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public lineChartData: ChartDataSets[] =[];
  public lineChartLabels: Label[]=[];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  counter ={};

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor( public router: Router,private tokenStorage: TokenStorageService) { }
  logout(){
    this.tokenStorage.signOut();
  }


  resetChart(){

    const user=this.tokenStorage.getUser();

    const role= user.role[0];

    console.log(role);

    if(role=="ADMIN"){

      for (let index = 1; index < 6 ;index++) {
       
        this.lineChartData.push({
        data:[0, 0, 0, 0, 0, 0],
        label:`Data ${index}`

        })
      }

      this.lineChartLabels= ["AAPL", "MSFT", "AMZN", "GOOG", "TSLA", "FB"];




    }else{

      for (let index = 1; index < 6 ;index++) {
       
        this.lineChartData.push({
        data:[0, 0, 0],
        label:`Data ${index}`

        })
      }
      this.lineChartLabels= ["AAPL", "AMZN", "GOOG"];

    }


    this.lineChartLabels.forEach(label => {

      this.counter[`${label}`]=0;
      this.counter[`time_${label}`]=new Date();
      
    });
  }

  ngOnInit(): void {

    if(!this.tokenStorage.getUser()){
      this.router.navigate(['auth/']);
    }

  this.resetChart();

    
      
      // Let us open a web socket
      var ws = new WebSocket("ws://116.203.84.33/","echo-protocol");

      ws.onopen = function() {
         
         // Web Socket is connected, send data using send()
         ws.send("Message to send");
         //alert("Message is sent...");
      };

      ws.onmessage =  (evt) =>{ 
         var received_msg = JSON.parse(evt.data)
         ;
         console.log("Message is received...",received_msg);

         let price= received_msg.price;
         let symbol=received_msg.symbol;

         let indexOfSymbol= this.lineChartLabels.indexOf(symbol);
         

         let index=0;
         let data= this.lineChartData[this.counter[`${symbol}`]];
         this.lineChartData.splice(this.counter[`${symbol}`], 1);

         data.data[indexOfSymbol]=price;
         this.lineChartData.push(data);
         this.counter[`${symbol}`]= parseInt( this.counter[`${symbol}`])+1;

         this.counter[`time_${symbol}`]=new Date();


         if( parseInt( this.counter[`${symbol}`]) %4==0){
          this.counter[`${symbol}`]=0;
         }
         




      };

      ws.onclose = function() { 
         
         // websocket is closed.
         alert("Connection is closed..."); 
      };
   

    

  }

  public randomize(): void {
    for (let i = 0; i < this.lineChartData.length; i++) {
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        this.lineChartData[i].data[j] = this.generateNumber(i);
      }
    }
    this.chart.update();
  }

  private generateNumber(i: number): number {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public hideOne(): void {
    const isHidden = this.chart.isDatasetHidden(1);
    this.chart.hideDataset(1, !isHidden);
  }

  public pushOne(): void {
    this.lineChartData.forEach((x, i) => {
      const num = this.generateNumber(i);
      const data: number[] = x.data as number[];
      data.push(num);
    });
    this.lineChartLabels.push(`Label ${this.lineChartLabels.length}`);
  }

  public changeColor(): void {
    this.lineChartColors[2].borderColor = 'green';
    this.lineChartColors[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
  }

  public changeLabel(): void {
    this.lineChartLabels[2] = ['1st Line', '2nd Line'];
  }
}

