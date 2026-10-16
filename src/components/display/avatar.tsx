import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#/utils/cn";

const avatarVariants = cva(
	"flex shrink-0 items-center justify-center rounded-full font-bold text-accent-foreground transition-colors duration-200",
	{
		variants: {
			size: {
				// rows of the sidebar, 36px
				default: "size-9 text-sm",
				// cards on mobile, 44px
				lg: "size-11 text-base",
			},
			tone: {
				default: "bg-accent",
				// on a green row the circle turns white, or it would vanish into the green
				raised: "bg-card",
			},
		},
		defaultVariants: {
			size: "default",
			tone: "default",
		},
	},
);

// first letters of the first two words, "Marko Horvat" becomes "MH"
const getInitials = (name: string) =>
	name
		.split(" ")
		.slice(0, 2)
		.map((word) => word.charAt(0).toUpperCase())
		.join("");

type AvatarProps = VariantProps<typeof avatarVariants> & {
	name: string;
	className?: string;
};

// circle with the initials of a person, the full name is always written next to it
export const Avatar = ({ name, size, tone, className }: AvatarProps) => (
	<span
		className={cn(avatarVariants({ size, tone }), className)}
		aria-hidden="true"
	>
		{getInitials(name)}
	</span>
);
