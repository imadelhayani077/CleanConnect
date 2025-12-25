import { ModeButton } from "@/components/ui/Button-mode";
import { ChevronDown, ArrowDown, MoveDown, ChevronsDown } from "lucide-react";
import React from "react";

export default function Contact() {
    return (
        <div>
            contact
            <div>
                // Usage examples:
                <ChevronDown className="w-4 h-4" /> // Simple chevron down
                <ArrowDown className="w-4 h-4" /> // Arrow with line
                <MoveDown className="w-4 h-4" /> // Arrow with dot
                <ChevronsDown className="w-4 h-4" /> // Double chevron
                <ModeButton />
            </div>
        </div>
    );
}
