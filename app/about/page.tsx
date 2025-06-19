'use client';

import { useEffect, useState } from "react";
import ImageWithText from "@/components/ImageWithText/ImageWithText";
import { Button } from "@mantine/core";

interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export default function Home() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const response = await fetch("/api/contributors");
        const data: Contributor[] = await response.json();
        setContributors(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
          setError(err.message || "Échec du chargement des contributeurs");
        } else if (typeof err === "string") {
          console.error(err);
          setError(err);
        }
      }
    };

    fetchContributors();
  }, []);

  return (



    <div className="min-h-screen bg-gray-100">

        <div className="min-h-screen flex flex-col items-center justify-center space-y-8 py-10">

        <h1 className="mt-8 text-xl font-bold text-gray-900 text-center"> About the project </h1>

        {contributors.map((contributor) => (
      <ImageWithText
        lien = {contributor.html_url}
        imageUrl= {contributor.avatar_url}
        altText={contributor.login}
        maincaption={contributor.login}
        
        secondarycaption= { ` ${contributor.contributions} ${contributor.contributions > 1?"contributions":"contribution"}`}
      />
            ))}
        <Button component="a" href="https://github.com/Maxeuh/Terraflow" variant="filled">Contribute on GitHub</Button>
    </div>

    </div>
  );
}

