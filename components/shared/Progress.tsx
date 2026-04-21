import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/utils";

export type SharedProgressCardProps = {
  title: React.ReactNode;
  value: number;
  stats?: React.ReactNode;
  "aria-label"?: string;
  cardClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  contentClassName?: string;
  progressClassName?: string;
  statsClassName?: string;
};

const SharedProgressCardComponent = ({
  title,
  value,
  stats,
  "aria-label": ariaLabel,
  cardClassName,
  headerClassName,
  titleClassName,
  contentClassName,
  progressClassName,
  statsClassName,
}: SharedProgressCardProps) => {
  return (
    <Card className={cn(cardClassName)}>
      <CardHeader className={cn(headerClassName)}>
        <CardTitle className={cn(titleClassName)}>{title}</CardTitle>
      </CardHeader>
      <CardContent className={cn(contentClassName)}>
        <Progress value={value} className={cn(progressClassName)} aria-label={ariaLabel} />
        {stats ? <div className={cn(statsClassName)}>{stats}</div> : null}
      </CardContent>
    </Card>
  );
};

export const SharedProgressCard = React.memo(SharedProgressCardComponent);

