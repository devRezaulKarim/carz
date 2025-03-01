"use client";

import React, { use } from "react";
import ClassifiedCard from "./classified-card";
import { ClassifiedWithImage } from "@/config/types";

interface ClassifiedsListProps {
  classifieds: Promise<ClassifiedWithImage[]>;
  favorites: number[];
}

const ClassifiedList = ({ classifieds, favorites }: ClassifiedsListProps) => {
  const inventory = use(classifieds);
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {inventory.map((classified) => {
        return (
          <ClassifiedCard
            key={classified.id}
            classified={classified}
            favorites={favorites}
          />
        );
      })}
    </div>
  );
};

export default ClassifiedList;
