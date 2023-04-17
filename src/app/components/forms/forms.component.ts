import { Component } from '@angular/core';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent {
  residents!: number; // quantity of residents

  washingMachineInput!: string; // get washing machine value
  dryerInput!: string; // get dryer value

  washingMachine!: boolean; // if there is washing machine
  dryer!: boolean; // if there is dryer

  rooms!: number;
  tvs!: number; // quantity of tvs
  pcs!: number; // quantity of pcs
  consumption: number = 0;
  pricePerHour!: number; // price per hour
  priceToPay!: number; // comsumption * pricePerHour
  result!: string; // phrase + priceToPay

  errorMessage!: string;

  averageWatts: any = { //watts
    'room': 60, // 60W per lightbulb
    'washingMachine': 1500, //500W - 2500W
    'dryer': 3000, //1000W - 5000W
    'pc': 300, //each pc 100W - 500W (desktop)
    'tv': 125, //50W - 200W
    'shower': 5000 //3000W - 8500W
  };

  averageTime: any = { // hour per month for each person considering one device
    'room': (4*30), // 4 hours per day * 30 days
    'washingMachine': (2*4), //1 - 3 week (1 hour per use) * 4 weeks 
    'dryer': (2*4), //1 - 3 week (1 hour per use) * 4 weeks 
    'pc': (3*30), //2 - 4 hours per day * 30 days
    'tv': (4*30), //3 - 5 hours per day * 30 days
    'shower': ((10/60)*30) //(10minutes per day / 60) * 30 days
  }

  setErrorMessage(message: string){
    this.errorMessage = message;
  }

  validateInputs(): void {
    this.consumption = 0;
    
    if (this.washingMachineInput === 'false' || this.washingMachineInput === undefined) {
      this.washingMachine = false;
      this.washingMachineInput = 'false';
    }
    else{
      this.washingMachine = true;
      this.washingMachineInput = 'true';
    }

    if (this.dryerInput === 'false' || this.dryerInput === undefined) {
      this.dryer = false;
      this.dryerInput = 'false';
    }
    else{
      this.dryer = true;
      this.dryerInput = 'true';
    }

    if (this.residents >= 0 && this.tvs >= 0 && this.pcs >= 0 && this.pricePerHour >= 0 && this.rooms >= 0) {
      this.result = this.getResult();
    }
    else {
      this.setErrorMessage('Preencha os campos corretamente!');
    }
  }

  getResult(): string {
    
    if (this.washingMachine === true){
      this.consumption += this.averageWatts['washingMachine'] *  this.averageTime['washingMachine'];
    }

    if (this.dryer === true){
      this.consumption += this.averageWatts['dryer'] * this.averageTime['dryer'];
    }

    this.consumption += (this.averageWatts['room'] * this.averageTime['room']) * this.rooms;
    this.consumption += (this.averageWatts['pc'] * this.averageTime['pc']) * this.pcs;
    this.consumption += (this.averageWatts['tv'] * this.averageTime['tv']) * this.tvs;
    this.consumption += (this.averageWatts['shower'] * this.averageTime['shower']) * this.residents;
    
    //convert consumption Wh to kWh:
    this.consumption /= 1000;

    this.priceToPay = this.consumption * this.pricePerHour;
    
    return `A estimativa é de que você gaste <span class="text-warning">${this.consumption}kWh</span> mensais e pague aproximadamente <span class="text-success">R$${this.priceToPay.toFixed(2)}</span>.`;
  }
}
