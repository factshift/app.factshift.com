import { parse }                   from '../../parser/parse.mjs';
import { CharacterCursor, Cursor } from '../../core/node/cursor.mjs';
class ParserDomSvg {
    constructor(svg) {
        this.svg = svg;
    }
    draw(text) {
        const svg = this.svg;
        const gs = svg.append('g')
            .selectAll('g')
            .data(text.split('').map((c, i) => ({ text: c, offset: i })))
            .join(d => {
            const g = d.append('g');
            g.append('rect');
            g.append('text');
            return g;
        }, d => {
            return d;
        }, d => d.remove())
            .classed('char', true);
        let newlines = 0;
        let x = 0;
        const map = new Map;
        gs.select('rect')
            .attr('font-size', '2rem')
            .attr('x', d => {
            const val = x++ * 2.5;
            map.set(d, Object.assign(Object.assign({}, (map.get(d) || {})), { x: val }));
            if (d.text === '\n') {
                x = 0;
            }
            return val + 'ch';
        })
            .attr('width', d => d.text === '\n' ? '2.5ch' : '2ch')
            .attr('height', '3rem')
            .style('fill', 'white')
            .attr('y', d => {
            const val = (3.5 * newlines);
            if (d.text === '\n') {
                newlines++;
                x = 0;
            }
            map.set(d, Object.assign(Object.assign({}, (map.get(d) || {})), { y: val }));
            this.svg.attr('height', (val + 4) + 'rem');
            return val + 'rem';
        });
        gs.select('text')
            .text(d => `${d.text === '\n' ? '\\n' : d.text}`)
            .attr('font-size', '2rem')
            .attr('x', d => map.get(d).x + 'ch')
            .attr('y', d => (map.get(d).y + 2) + 'rem')
            .attr('dx', '.2ch')
            .style('text-align', 'center');
    }
}
export class ParserDom {
    constructor({ form, controls, output }) {
        this.svg = null;
        const state = {
            error: null,
            generator: undefined,
            text: '',
            tokens: [],
            chars: [],
            yielded: [],
        };
        this.output = output;
        this.form = form;
        this.controls = controls;
        this.state = state;
        this.reset();
    }
    reset() {
        const text = this.form.elements.formInput.value;
        this.resetGeneratorControlDisplay();
        this.state.text = text;
        this.state.error = null;
        this.state.generator = parse(text, { asGenerator: true });
        this.state.tokens = [];
        this.state.chars = [];
        this.state.yielded = [];
        this.output.text.value = '';
        this.output.text.className = '';
        this.svg = new ParserDomSvg(this.output.svg);
        this.svg.draw(text || '');
        this.form.onsubmit = event => {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            this.reset();
        };
    }
    resetCopyToClipboardButton() {
        this.controls.copy.onclick = e => {
            e.preventDefault();
            const copyText = JSON.stringify(this.state.tokens);
            console.log(this.state.tokens);
            // @ts-ignore
            navigator.clipboard.writeText(copyText).then(e => {
                //@ts-ignore
                alert('copied text');
            });
        };
    }
    resetPlayButton() {
        this.controls.play.innerText = 'play';
        this.controls.play.onclick = () => {
            this.reset();
            this.play();
        };
    }
    resetAdvanceButton() {
        let played;
        this.controls.forward.onclick = () => {
            console.log('advance');
            this.advance();
        };
    }
    resetGeneratorControlDisplay() {
        this.controls.forward.style.display = 'block'; // this is not currently functional
        this.controls.play.style.display = 'block';
        this.controls.submit.style.display = 'none';
        this.controls.play.focus();
        this.resetCopyToClipboardButton();
        this.resetPlayButton();
        this.resetAdvanceButton();
    }
    handleCompletion() {
        const out = {
            identities: this.state.tokens.map(n => n.identity),
            tokens: this.state.tokens.map(n => n.toJSON()),
            // chars: this.state.chars
        };
        console.log(this.state.tokens.map(n => n.identity));
        console.log(out);
        this.output.text.value = JSON.stringify(out, null, 3);
        this.resetGeneratorControlDisplay();
    }
    advance() {
        const generator = this.state.generator;
        if (!generator || this.state.error) {
            return {
                done: true,
            };
        }
        let _yielded, status = 'success';
        let done = false;
        try {
            const { value: out, done: _done } = generator.next();
            if (_done) {
                done = _done;
            }
            else {
                _yielded = out;
                // for verbose logging information during parsing
                // console.log('yielded: ', _yielded)
                if (out === false) {
                    throw new Error('parser returned false');
                }
            }
        }
        catch (e) {
            this.state.error = true;
            console.log(e);
            _yielded = e.message;
            status = 'error';
        }
        this.output.text.className = status;
        if (this.state.error || done) {
            this.handleCompletion();
        }
        else {
            this.output.text.value = JSON.stringify(_yielded, null, 3);
            if (CharacterCursor.isCharacterCursor(_yielded)) {
                this.state.tokens.push(_yielded.getToken());
            }
            else if (Cursor.isCursorPosition(_yielded)) {
                this.state.chars.push(_yielded);
                _yielded && this.output.svg.selectAll('.char')
                    .style('fill', d => (d.offset === _yielded.offset) ? 'var(--filled-text)' : 'var(--unfilled-text)')
                    .select('rect')
                    .style('fill', d => (d.offset === _yielded.offset) ? 'var(--filled)' : 'var(--unfilled)');
            }
            else {
                if (typeof _yielded === 'string') {
                    this.state.yielded.push(_yielded);
                }
                this.advance();
            }
        }
        return { value: _yielded, status, done: done };
    }
    play() {
        let paused;
        let play;
        this.controls.play.innerText = 'pause';
        this.controls.play.onclick = () => {
            this.controls.play.innerText = 'play';
            paused = true;
            this.controls.play.onclick = play;
        };
        play = () => setTimeout(() => {
            if (paused)
                return;
            const out = this.advance();
            if (out.value === false) {
                paused = true;
                return;
            }
            if (out.done)
                return;
            play && play();
        }, 10);
        play();
    }
}
