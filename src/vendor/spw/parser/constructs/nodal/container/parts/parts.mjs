import { nominal }     from "../../nominal/generator.mjs";
import { numeric }     from "../../numeric/generator.mjs";
import { phrasal }     from "../../../operational/semantic/phrasal/generator.mjs";
import { common }      from "../../../operational/semantic/common/generator.mjs";
import { ordinal }     from "../../../operational/semantic/ordinal/generator.mjs";
import { container }   from "../generator.mjs";
import { operational } from "../../../operational/pragmatic/generator.mjs";
import { literal }     from "../../literal/generator.mjs";
export const containerPartOptions = [
    nominal,
    numeric,
    container,
    literal,
    phrasal,
    common,
    ordinal,
    operational
];
