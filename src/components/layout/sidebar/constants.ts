/* How the sidebar animates between its two widths: only the width of the aside
   changes. Every row keeps its icon at the same distance from the left edge and
   clips what does not fit, so icons stay still while the labels slide out of view
   and fade. Nothing is added to or removed from the page during the change. */

// a row of the sidebar: rounded, inset from the edges, clipped to its own width
export const ROW_CLASSES =
	"flex items-center overflow-hidden whitespace-nowrap rounded-lg transition-colors duration-200";
// text that fades out as the sidebar turns into a rail
export const LABEL_CLASSES = "transition-opacity duration-200 rail:opacity-0";
