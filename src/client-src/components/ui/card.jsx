import { cn } from "../../lib/utils"

const Card = ({ className, ...props }) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
)
Card.displayName = "Card"

const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-4", className)} {...props} />
)
CardHeader.displayName = "CardHeader"

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
)
CardTitle.displayName = "CardTitle"

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-4 pt-0", className)} {...props} />
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
