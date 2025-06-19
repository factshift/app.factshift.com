import { nominal }     from "../../../nodal/nominal/generator.mjs";
import { numeric }     from "../../../nodal/numeric/generator.mjs";
import { phrasal }     from "../../semantic/phrasal/generator.mjs";
import { operational } from "../generator.mjs";
import { container }   from "../../../nodal/container/generator.mjs";
export const operationalPartOptions = [
    nominal,
    numeric,
    container,
    phrasal,
    operational
];
