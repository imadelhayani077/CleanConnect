import React from "react";
import {
    Play,
    Compass,
    Radio,
    Library,
    ListMusic,
    Music2,
    User,
    Mic2,
    Disc3,
    Clock,
    TrendingUp,
    Users,
    Moon,
    GaugeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function SideBar() {
    const [activeItem, setActiveItem] = React.useState("listen-now");

    const discoverItems = [
        { id: "listen-now", icon: Play, label: "Listen Now" },
        { id: "browse", icon: Compass, label: "Browse" },
        { id: "radio", icon: Radio, label: "Radio" },
    ];

    const libraryItems = [
        { id: "playlists", icon: ListMusic, label: "Playlists" },
        { id: "songs", icon: Music2, label: "Songs" },
        { id: "made-for-you", icon: User, label: "Made for You" },
        { id: "artists", icon: Mic2, label: "Artists" },
        { id: "albums", icon: Disc3, label: "Albums" },
    ];

    const playlistItems = [
        { id: "recently-added", icon: Clock, label: "Recently Added" },
        { id: "recently-played", icon: Play, label: "Recently Played" },
        { id: "top-songs", icon: TrendingUp, label: "Top Songs" },
        { id: "top-albums", icon: Disc3, label: "Top Albums" },
        { id: "top-artists", icon: Users, label: "Top Artists" },
        { id: "logic-discography", icon: Disc3, label: "Logic Discography" },
        { id: "bedtime-beats", icon: Moon, label: "Bedtime Beats" },
    ];

    return (
        <div className="min-h-screen bg-white">
            <div
                className="
    w-64
    min-h-screen
    border-r
    border-border
    bg-background
"
            >
                <div className="p-4 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between px-2">
                        <h1 className="text-2xl font-bold">
                            <GaugeIcon className="inline mb-1 mr-1" />
                            Dashboard
                        </h1>
                    </div>

                    <ScrollArea className="h-[calc(100vh-5rem)]">
                        <div className="space-y-6 pr-4">
                            {/* Discover Section */}
                            <div className="space-y-1">
                                <h2 className="px-2 text-sm font-semibold text-muted-foreground mb-2">
                                    Discover
                                </h2>
                                {discoverItems.map((item) => (
                                    <Button
                                        key={item.id}
                                        variant="ghost"
                                        onClick={() => setActiveItem(item.id)}
                                        className={cn(
                                            "w-full justify-start gap-3",
                                            activeItem === item.id &&
                                                "bg-muted text-foreground hover:bg-muted"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Button>
                                ))}
                            </div>

                            {/* Library Section */}
                            <div className="space-y-1">
                                <h2 className="px-2 text-sm font-semibold text-muted-foreground mb-2">
                                    Library
                                </h2>
                                {libraryItems.map((item) => (
                                    <Button
                                        key={item.id}
                                        variant="ghost"
                                        onClick={() => setActiveItem(item.id)}
                                        className={cn(
                                            "w-full justify-start gap-3",
                                            activeItem === item.id &&
                                                "bg-muted text-foreground hover:bg-muted"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Button>
                                ))}
                            </div>

                            {/* Playlists Section */}
                            <div className="space-y-1">
                                <h2 className="px-2 text-sm font-semibold text-muted-foreground mb-2">
                                    Playlists
                                </h2>
                                {playlistItems.map((item) => (
                                    <Button
                                        key={item.id}
                                        variant="ghost"
                                        onClick={() => setActiveItem(item.id)}
                                        className={cn(
                                            "w-full justify-start gap-3",
                                            activeItem === item.id &&
                                                "bg-muted text-foreground hover:bg-muted"
                                        )}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
