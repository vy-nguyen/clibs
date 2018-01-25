/**
 * Written by Vy Nguyen (2017)
 * BSD License
 */
'use strict';

class ShoppingAcct
{
    constructor() {
        this.priceSum  = 0.0;
        this.itemCount = 0;
        this.shipping  = 0.0;
        this.tax       = 0.0;
        this.totalCost = 0.0;

        this.taxRate   = 0.0975;
        this.shipRate  = 0.05;
        this.minShip   = 5.00;
    }

    updateItem(unitCost, count) {
        let sub = unitCost * count;

        this.itemCount += count;
        this.priceSum  += sub;
        return sub;
    }

    compute() {
        this.tax      = (this.taxRate * this.priceSum);
        this.shipping = (this.shipRate * this.priceSum);

        if (this.shipping < this.minShip) {
            this.shipping = this.minShip;
        }
        this.totalCost = this.priceSum + this.tax + this.shipping;
    }

    getTax() {
        return this.tax;
    }

    getShipping() {
        return this.shipping;
    }

    getSubTotal() {
        return this.priceSum;
    }

    getTotal() {
        return this.totalCost;
    }
}

export default ShoppingAcct;
