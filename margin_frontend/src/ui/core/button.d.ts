import { type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
declare const buttonVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
    size?: "sm" | "md" | "lg" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    children: ReactNode;
}
export declare function Button({ className, variant, size, children, ...props }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export {};
