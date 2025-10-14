// Lightweight module declarations to satisfy TypeScript in this workspace
declare module 'next-themes' {
  export function useTheme(): { theme?: string };
}

declare module 'sonner' {
  const ToasterDefault: any;
  export default ToasterDefault;
  export const Toaster: any;
}

declare module 'react-resizable-panels' {
  const R: any;
  export = R;
}

declare module 'input-otp' {
  const OTP: any;
  export const OTPInput: any;
  export const OTPInputContext: any;
  export default OTP;
}

declare module 'react-hook-form' {
  export const Controller: any;
  export type ControllerProps<TFieldValues = any, TName = any> = any;
  export type FieldPath<T = any> = any;
  export type FieldValues = any;
  export const FormProvider: any;
  export function useFormContext(): any;
}

declare module 'vaul' {
  export const Drawer: any;
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Close: any;
  export const Overlay: any;
  export const Content: any;
  export const Title: any;
  export const Description: any;
}

declare module 'cmdk' {
  export const Command: any;
  export const List: any;
  export const Empty: any;
  export const Group: any;
  export const Input: any;
  export const Separator: any;
  export const Item: any;
}
