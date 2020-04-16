import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgxSiemaOptions, NgxSiemaService} from 'ngx-siema';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Product} from '../../../models/product.model';

@Component({
    selector: 'app-main-slider',
    templateUrl: './main-slider.component.html',
    styleUrls: ['./main-slider.component.scss']
})
export class MainSliderComponent implements OnInit, OnDestroy {
    private unsubscribe$ = new Subject();
    @Input() public items: Product[];
    public currentSlide: number;
    public imagesLoaded: number[];

    public options: NgxSiemaOptions = {
        selector: '.siema',
        duration: 200,
        easing: 'ease-out',
        perPage: 1,
        startIndex: 0,
        draggable: true,
        threshold: 20,
        loop: false,
        onInit: () => {
            // runs immediately after first initialization
        },
        onChange: () => {
            // runs after slide change
        }
    };

    constructor(private ngxSiemaService: NgxSiemaService) {
    }

    ngOnInit() {
        this.currentSlide = 0;
        this.imagesLoaded = [];
    }

    public prev() {
        if (this.currentSlide > 0) {
            this.ngxSiemaService
                .prev(1)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((data: any) => {
                    this.currentSlide = data.currentSlide;
                });
        } else {
          this.goTo(this.items.length);
        }
    }

    public next() {
        if (this.currentSlide < this.items.length - 1) {
            this.ngxSiemaService
                .next(1)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe((data: any) => {
                    this.currentSlide = data.currentSlide;
                });
        } else {
          this.goTo(0);
        }
    }

    public goTo(index: number) {
        this.ngxSiemaService
            .goTo(index)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((data: any) => {
                this.currentSlide = data.currentSlide;
            });
    }

    public onImageLoad(id: number) {
        this.imagesLoaded.push(id);
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
