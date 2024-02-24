import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  searchValue = '';
  private runningSearch = new Subject<string>();
  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.runningSearch.next(this.searchValue);
  }

  ngOnInit(): void {
    this.runningSearch.pipe(
      debounceTime(200),
      distinctUntilChanged()
    ).subscribe(value => this.search.emit(value));
  }
}
