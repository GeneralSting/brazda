import { useId } from "react";
import { cn } from "#/lib/utils";

// lowercase letter b on a 32x32 grid
const LETTER_PATH =
	"M5 3H8.5A3.5 3.5 0 0 1 12 6.5V29H5Z M14 12H20A8.5 8.5 0 0 1 28.5 20.5A8.5 8.5 0 0 1 20 29H14Z";
// two furrows cut across the lower part of the letter
const FURROW_PATHS = ["M2 31Q14 21.5 31 19.6", "M2 22.8Q13.5 15.6 31 16.2"];
// ripe field under the lower furrow
const FIELD_PATH = "M0 32L2 31Q14 21.5 31 19.6V32Z";
// below this size the gold field is left out of the tile and only the furrows stay
const MIN_SIZE_WITH_FIELD = 28;

type LogoProps = {
	variant?: "tile" | "mark"; // tile: white letter on a green rounded square, mark: the letter alone
	size?: number; // height of the sign in pixels
	wordmark?: boolean; // shows the name "brazda" next to the sign
	inverse?: boolean; // white version for green backgrounds
	className?: string;
	wordmarkClassName?: string; // classes for the name alone, e.g. to fade it out
};

export const Logo = ({
	variant = "tile",
	size = 32,
	wordmark = true,
	inverse = false,
	className,
	wordmarkClassName,
}: LogoProps) => {
	const id = useId();
	const maskId = `${id}-mask`;
	const clipId = `${id}-clip`;

	const isTile = variant === "tile";
	const letterColor = isTile || inverse ? "#ffffff" : "var(--primary)";
	const hasField = !(isTile && size < MIN_SIZE_WITH_FIELD);

	const letter = (
		<g>
			<defs>
				<clipPath id={clipId}>
					<path d={LETTER_PATH} />
				</clipPath>
				<mask
					id={maskId}
					maskUnits="userSpaceOnUse"
					x={0}
					y={0}
					width={32}
					height={32}
				>
					<rect width={32} height={32} fill="#fff" />
					{FURROW_PATHS.map((furrow) => (
						<path
							key={furrow}
							d={furrow}
							stroke="#000"
							strokeWidth={1.7}
							fill="none"
						/>
					))}
				</mask>
			</defs>
			<g mask={`url(#${maskId})`}>
				<path d={LETTER_PATH} fill={letterColor} />
				{hasField ? (
					<path
						d={FIELD_PATH}
						fill="var(--brand-gold)"
						clipPath={`url(#${clipId})`}
					/>
				) : null}
			</g>
		</g>
	);

	return (
		<span
			className={cn("inline-flex items-center", className)}
			style={{ gap: Math.round(size * (isTile ? 0.3 : 0.22)) }}
		>
			<svg
				width={size}
				height={size}
				viewBox="0 0 32 32"
				className="block shrink-0"
				role="img"
				aria-label="Brazda"
			>
				{isTile ? (
					<>
						<rect width={32} height={32} rx={7.5} fill="var(--primary)" />
						{/* the letter takes 60% of the tile, centred */}
						<g transform="translate(6.4 6.4) scale(0.6)">{letter}</g>
					</>
				) : (
					letter
				)}
			</svg>
			{wordmark ? (
				<span
					aria-hidden="true"
					className={cn(
						"font-extrabold leading-none tracking-[-0.03em]",
						wordmarkClassName,
					)}
					style={{
						fontSize: Math.round(size * (isTile ? 0.66 : 0.78)),
						color: inverse ? "#ffffff" : "var(--primary)",
					}}
				>
					brazda
				</span>
			) : null}
		</span>
	);
};
