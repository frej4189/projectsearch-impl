import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-multi-slider',
  templateUrl: './multi-slider.component.html',
  styleUrl: './multi-slider.component.scss'
})
export class MultiSliderComponent implements OnInit {

  @Output() selectedPriceRange = new EventEmitter<[number, number]>();

  @Input() minimumPrice = 0;
  @Input() maximumPrice = 100;
  minSelected = 0;
  maxSelected = 100;

  private runningPriceUpdate = new Subject<[number, number]>();

  ngOnInit() {
    this.minSelected = this.minimumPrice;
    this.maxSelected = this.maximumPrice;

    this.runningPriceUpdate.pipe(
      debounceTime(200),
      distinctUntilChanged((prev, curr) => prev[0] === curr[0] && prev[1] === curr[1])
    ).subscribe(value => this.selectedPriceRange.emit(value));
  }

  checkMin() {
    if(this.minSelected > this.maxSelected) this.minSelected = this.maxSelected;
    if(this.minSelected < this.minimumPrice) this.minSelected = this.minimumPrice;

    this.runningPriceUpdate.next([this.minSelected * 100, this.maxSelected * 100]);
  }

  checkMax() {
    if(this.maxSelected < this.minSelected) this.maxSelected = this.minSelected;
    if(this.maxSelected > this.maximumPrice) this.maxSelected = this.maximumPrice;

    this.runningPriceUpdate.next([this.minSelected * 100, this.maxSelected * 100]);
  }
}
