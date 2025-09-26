import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground dark:border-[#505050] dark:bg-[#232428] manrope-font border border-[#A0AEC0]  flex flex-col gap-6 rounded-xl shadow-md py-6",
        className
      )}
      {...props} />
  );
}

function Card3({
  className,
  bgColor = "dark:bg-[#101010] bg-card", // Default values
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "text-card-foreground manrope-font border border-[#DDDDDD] dark:border-[#505050] flex flex-col gap-6 rounded-xl shadow-md py-6",
        bgColor, // Apply the bgColor prop
        className // Allow className to override
      )}
      {...props}
    />
  );
}

function Card2({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        " text-card-foreground dark:border-[#505050]  manrope-font border border-[#A0AEC0]  flex flex-col gap-6 rounded-xl shadow-md py-6",
        className
      )}
      {...props} />
  );
}

function Card4({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        " text-card-foreground   manrope-font  flex flex-col gap-6 rounded-xl  py-6",
        className
      )}
      {...props} />
  );
}

function Card1({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground manrope-font flex flex-col gap-6 rounded-xl ",
        className
      )}
      {...props} />
  );
}

function CardHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col manrope-font gap-1.5 px-6", className)}
      {...props} />
  );
}

function CardTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none manrope-font font-semibold", className)}
      {...props} />
  );
}

function CardDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground manrope-font text-sm", className)}
      {...props} />
  );
}

function CardContent({
  className,
  ...props
}) {
  return (<div data-slot="card-content " className={cn("px-2 md:px-6", className)} {...props} />);
}

function CardContent1({
  className,
  ...props
}) {
  return (<div data-slot="card-content " className={cn("px-2", className)} {...props} />);
}
function CardFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center manrope-font px-6", className)}
      {...props} />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, Card1, CardContent1, Card2, Card3, Card4 }
