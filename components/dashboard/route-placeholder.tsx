import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RoutePlaceholderProps = {
  description: string;
  title: string;
};

export function RoutePlaceholder({ description, title }: RoutePlaceholderProps) {
  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-sm leading-6">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Phase 3 authentication protection is active. Feature implementation for this route continues in the next phases.
        </p>
      </CardContent>
    </Card>
  );
}
