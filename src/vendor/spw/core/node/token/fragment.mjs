export class TokenFragment {
    constructor(head, operator = undefined, isPrefixed = false) {
        this._head = head;
        this._operator = operator;
        this._isPrefixed = isPrefixed;
    }
    operator(operator) {
        if (!operator)
            return this._operator;
        this._operator = operator;
    }
    get parts() {
        const parts = [this._head, this._operator];
        return this._isPrefixed ? parts.reverse() : parts;
    }
}
export class Head extends TokenFragment {
}
export class BodyItem extends TokenFragment {
    get parts() {
        return this._isPrefixed ? super.parts.reverse() : super.parts;
    }
}
export class Body extends TokenFragment {
}
export class Tail extends TokenFragment {
}
