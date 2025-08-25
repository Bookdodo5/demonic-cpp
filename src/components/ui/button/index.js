import { cva } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "cursor-pointer border-2 border-primary bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary/80 dark:shadow-primary/25",
        destructive:
          "cursor-pointer bg-chart-2 text-white shadow-xs hover:bg-chart-2/80 focus-visible:ring-chart-2/20 dark:focus-visible:ring-chart-2/40",
        outline:
          "cursor-pointer border-2 border-primary/20 bg-background/50 backdrop-blur-sm shadow-sm hover:bg-primary/5 hover:border-primary hover:shadow-md dark:border-primary/30 dark:hover:bg-primary/10",
        secondary:
          "cursor-pointer bg-chart-3 text-secondary-foreground shadow-xs hover:bg-chart-3/80",
        ghost:
          "cursor-pointer hover:bg-accent/20 hover:text-accent-foreground",
        link: "text-chart-5 underline-offset-4 hover:underline hover:text-chart-5/80",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
