import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, NavController } from '@ionic/angular';
import { ProductService } from '../../../../../services/commerce/product.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {

  formFactory: any = FormBuilder;
  isLoading: boolean = false;
  message: string;
  product: any;
  productUUID: string;

  monthNames = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June", 
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December" 
  ];
  
  monthNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  monthList = [];
  yearList = [];

  constructor(
    public navCtrl: NavController,
    private _location: Location,
    private _fb: FormBuilder,
    private _router: Router,
    private _productService: ProductService,
    private _activatedRoute: ActivatedRoute,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    // Editor edit
    this.productUUID = this._activatedRoute.snapshot.paramMap.get('product_uuid');
    if (this.productUUID) this.loadProduct();

    // Generate months
    for (let i in this.monthNumbers) {
      let o = {
        'number': this.monthNumbers[i],
        'name': this.monthNames[i],
      }

      this.monthList.push(o);
    }

    // Generate years
    var currentYear = new Date().getFullYear();
    var startYear = 2018;  
    while ( startYear <= currentYear ) {
      this.yearList.push(startYear++ + 1);
    }

    // Initial form
    this.formFactory = this._fb.group({
      name: ['', [Validators.required]],
      deadline_day: ['', [Validators.required]],
      deadline_month: ['', [Validators.required]],
      deadline_year: ['', [Validators.required]],
      delivery_day: ['', [Validators.required]],
      delivery_month: ['', [Validators.required]],
      delivery_year: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      is_active: [false, [Validators.required]],
    });
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  onSubmit(): void {
    const order_deadline = new Date(
      this.formFactory.value.deadline_year, 
      this.formFactory.value.deadline_month,
      this.formFactory.value.deadline_day
    )

    const delivery_date = new Date(
      this.formFactory.value.delivery_year, 
      this.formFactory.value.delivery_month,
      this.formFactory.value.delivery_day
    )

    this.formFactory.value.order_deadline = order_deadline;
    this.formFactory.value.delivery_date = delivery_date;
    
    if (this.productUUID) {
      this.edit(this.formFactory.value);
    } else {
      this.create(this.formFactory.value);
    }
  }

  create(data: any): void {
    this._productService.create(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.product = response;
          this._router.navigate(['/product', this.product.uuid], {replaceUrl: true});
        },
        (failure: any) => {

        }
      )
  }

  edit(data: any): void {
    this._productService.edit(data, this.productUUID)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.product = response;
          this._router.navigate(['/product', this.product.uuid], {replaceUrl: true});
        },
        (failure: any) => {

        }
      )
  }

  delete(): void {
    this._productService.delete(this.productUUID)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this._router.navigate(['/tabs/tab1/sell'], {replaceUrl: true});
        },
        (failure: any) => {

        }
      )
  }

  dateChoices(i: number) {
    return new Array(i);
  }

  loadProduct(): void {
    this.isLoading = true;

    this._productService.single('', this.productUUID)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.product = response;
  
          const order_deadline = new Date(this.product.order_deadline);
          const delivery_date = new Date(this.product.delivery_date);

          this.formFactory.patchValue({
            name: this.product.name,
            deadline_day: order_deadline.getDay(),
            deadline_month: order_deadline.getMonth(),
            deadline_year: order_deadline.getFullYear(),
            delivery_day: delivery_date.getDay(),
            delivery_month: delivery_date.getMonth(),
            delivery_year: delivery_date.getFullYear(),
            description: this.product.description,
            price: this.product.price,
            is_active: this.product.is_active,
          });
        },
        (failure: any) => {

        }
      )
  }

  fileChangeEvent(event: any): void {
    let file = event.target.files[0];
    let data = {
      'attach_file': file, 
      'title': file.name, 
      'product': this.product.id
    };

    // open dialog
    if (this.product) {
      this.uploadAttachment(data);
    } else {
      console.log(data);
      console.log('B');
    }

    // clear file value
    event.target.value = '';
  }

  uploadAttachment(data: any): void {
    this._productService.createAttachment(this.productUUID, data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.product.picture = response.attach_file;
        },
        (failure: any) => {

        }
      )
  }

}
