import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, NavController } from '@ionic/angular';
import { ProductService } from '../../../../../services/commerce/product.service';
import { EventService } from '../../../../../services/event.service';
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
  imageURL: string;
  attachmentData: any;

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
  geoMessage: string;
  latitude: string;
  longitude: string;
  isGeolocation: boolean = false;
  isLocationRetrieve: boolean = true;

  constructor(
    public navCtrl: NavController,
    private _location: Location,
    private _fb: FormBuilder,
    private _router: Router,
    private _productService: ProductService,
    private _activatedRoute: ActivatedRoute,
    private _eventService: EventService,
    public alertController: AlertController
  ) { }

  getLocation() {
    this.isLocationRetrieve = false;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
    } else { 
      this.geoMessage = "Geolocation is not supported by this browser.";
    }
  }

  showPosition = (position: any) => {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    this.isLocationRetrieve = true;
  }

  showError = (error: any) => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        this.geoMessage = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        this.geoMessage = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        this.geoMessage = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        this.geoMessage = "An unknown error occurred."
        break;
    }

    this.isLocationRetrieve = true;
  }

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
    let currentDay = new Date().getDate();
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();
    let startYear = 2018;  

    while ( startYear <= currentYear ) {
      this.yearList.push(startYear++ + 1);
    }

    // Initial form
    this.formFactory = this._fb.group({
      name: ['', [Validators.required]],
      deadline_day: [currentDay, [Validators.required]],
      deadline_month: [currentMonth, [Validators.required]],
      deadline_year: [currentYear, [Validators.required]],
      delivery_day: [currentDay+7, [Validators.required]],
      delivery_month: [currentMonth, [Validators.required]],
      delivery_year: [currentYear, [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],
      is_active: [false, [Validators.required]],
      is_geolocation: [false, [Validators.required]],
    });
  }

  back(): void {
    this.navCtrl.setDirection("back", true, "back");
    this._location.back();
  }

  locationSet(event: any) {
    this.isGeolocation = this.formFactory.value.is_geolocation;
    if (this.getLocation) {
      this.getLocation();
    } else {
      this.latitude = '';
      this.longitude = '';
    }
  }

  onSubmit(): void {
    const order_deadline = new Date(
      this.formFactory.value.deadline_year, 
      +this.formFactory.value.deadline_month - 1,
      this.formFactory.value.deadline_day
    )

    const delivery_date = new Date(
      this.formFactory.value.delivery_year, 
      +this.formFactory.value.delivery_month - 1,
      this.formFactory.value.delivery_day
    )

    this.formFactory.value.order_deadline = order_deadline;
    this.formFactory.value.delivery_date = delivery_date;

    if (this.isGeolocation) {
      this.formFactory.value.latitude = this.latitude;
      this.formFactory.value.longitude = this.longitude;
    } else {
      this.formFactory.value.latitude = null;
      this.formFactory.value.longitude = null;
    }
    
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
          this.productUUID = this.product.uuid;
          
          // Upload attachment
          if (this.attachmentData) {
            const x = {
              ...this.attachmentData,
              'product': this.product.id,
            }
            this.uploadAttachment(x, true);

          } else {
            // to detail
            this._router.navigate(['/product', this.product.uuid], {replaceUrl: true});
          
            // trigger sell page
            this._eventService.publish('commerce:productCreated', this.product);
          }
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

          // trigger sell page
          this._eventService.publish('commerce:productUpdated', this.product);
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

          // trigger sell page
          this._eventService.publish('commerce:productDeleted', this.product);
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

          if (this.product.latitude) {
            this.isGeolocation = true;
          }
        })
      )
      .subscribe(
        (response: any) => {
          this.product = response;

          const order_deadline = new Date(this.product.order_deadline);
          const delivery_date = new Date(this.product.delivery_date);

          this.formFactory.patchValue({
            name: this.product.name,
            deadline_day: order_deadline.getDate(),
            deadline_month: order_deadline.getMonth(),
            deadline_year: order_deadline.getFullYear(),
            delivery_day: delivery_date.getDate(),
            delivery_month: delivery_date.getMonth(),
            delivery_year: delivery_date.getFullYear(),
            description: this.product.description,
            price: this.product.price,
            is_active: this.product.is_active,
            is_geolocation: (this.product.latitude && this.product.longitude ? true : false),
          });
        }
      )
  }

  fileChangeEvent(event: any): void {
    let file = event.target.files[0];
    this.attachmentData = {
      'attach_file': file, 
      'title': file.name, 
      'product': this.product?.id
    };

    console.log(file);

    // open dialog
    if (this.product) {
      this.uploadAttachment(this.attachmentData);
    } else {

      if (!this.product) {
        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
          this.imageURL = reader.result as string;
        }
        reader.readAsDataURL(file)
      }
    }

    // clear file value
    event.target.value = '';
  }

  uploadAttachment(data: any, isNew: boolean = false): void {
    this._productService.createAttachment(this.productUUID, data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.product.picture = response.attach_file;

          if (isNew) {
            // to detail
            this._router.navigate(['/product', this.product.uuid], {replaceUrl: true});
          
            // trigger sell page
            this._eventService.publish('commerce:productCreated', this.product);
          }
        }
      )
  }

}
