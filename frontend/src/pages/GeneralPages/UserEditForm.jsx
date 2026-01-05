// // src/components/user/UserEditForm.jsx
// import React from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Loader2, Lock, KeyRound } from "lucide-react";

// export function UserEditForm({
//     mode = "self", // "self" | "admin"
//     values,
//     onChange,
//     onSubmit,
//     onCancel,
//     isSubmitting,
// }) {
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         onChange({ ...values, [name]: value });
//     };

//     return (
//         <form onSubmit={onSubmit} className="space-y-5">
//             {/* Common fields */}
//             <div className="space-y-2">
//                 <Label htmlFor="name">Full name</Label>
//                 <Input
//                     id="name"
//                     name="name"
//                     value={values.name}
//                     onChange={handleChange}
//                     className="bg-background"
//                 />
//             </div>

//             <div className="space-y-2">
//                 <Label htmlFor="email">Email address</Label>
//                 <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={values.email}
//                     onChange={handleChange}
//                     className="bg-background"
//                 />
//             </div>

//             <div className="space-y-2">
//                 <Label htmlFor="phone">Phone number</Label>
//                 <Input
//                     id="phone"
//                     name="phone"
//                     type="tel"
//                     value={values.phone}
//                     onChange={handleChange}
//                     className="bg-background"
//                 />
//             </div>

//             {/* Admin editing another user: role + admin self password */}
//             {mode === "admin" && (
//                 <>
//                     <div className="space-y-2">
//                         <Label>Role</Label>
//                         <Select
//                             value={values.role}
//                             onValueChange={(role) =>
//                                 onChange({ ...values, role })
//                             }
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select role" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="admin">Admin</SelectItem>
//                                 <SelectItem value="client">Client</SelectItem>
//                                 <SelectItem value="sweepstar">
//                                     Sweepstar
//                                 </SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="p-4 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50 space-y-3">
//                         <Label
//                             htmlFor="admin_password"
//                             className="flex items-center gap-2 text-foreground font-semibold"
//                         >
//                             <KeyRound className="w-4 h-4 text-orange-500" />
//                             Your admin password (required)
//                         </Label>
//                         <Input
//                             id="admin_password"
//                             name="admin_password"
//                             type="password"
//                             value={values.admin_password}
//                             onChange={handleChange}
//                             placeholder="Confirm with your password"
//                             className="bg-background border-orange-200 focus:ring-orange-500"
//                             required
//                         />
//                     </div>
//                 </>
//             )}

//             {/* Self edit password fields */}
//             {mode === "self" && (
//                 <div className="space-y-5 pt-4 border-t border-dashed">
//                     <div className="space-y-2">
//                         <Label
//                             htmlFor="password"
//                             className="flex items-center gap-2 text-muted-foreground"
//                         >
//                             <Lock className="w-4 h-4" />
//                             New password (optional)
//                         </Label>
//                         <Input
//                             id="password"
//                             name="password"
//                             type="password"
//                             value={values.password}
//                             onChange={handleChange}
//                             placeholder="Leave empty to keep current"
//                             className="bg-background"
//                         />
//                     </div>

//                     <div className="p-4 bg-orange-50/50 dark:bg-orange-950/20 rounded-lg border border-orange-200/50 space-y-3">
//                         <Label
//                             htmlFor="current_password"
//                             className="flex items-center gap-2 text-foreground font-semibold"
//                         >
//                             <KeyRound className="w-4 h-4 text-orange-500" />
//                             Current password (required)
//                         </Label>
//                         <Input
//                             id="current_password"
//                             name="current_password"
//                             type="password"
//                             value={values.current_password}
//                             onChange={handleChange}
//                             placeholder="Enter your current password"
//                             className="bg-background border-orange-200 focus:ring-orange-500"
//                             required
//                         />
//                     </div>
//                 </div>
//             )}

//             {/* Actions */}
//             <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
//                 {onCancel && (
//                     <Button
//                         type="button"
//                         variant="outline"
//                         onClick={onCancel}
//                         disabled={isSubmitting}
//                     >
//                         Cancel
//                     </Button>
//                 )}
//                 <Button type="submit" disabled={isSubmitting} className="gap-2">
//                     {isSubmitting && (
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                     )}
//                     Save changes
//                 </Button>
//             </div>
//         </form>
//     );
// }
