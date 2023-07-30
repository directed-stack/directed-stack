

import type { ReactNode, Ref, RefObject} from "react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { cn } from "~/utils";

interface HintTooltipProps {
  text: string;
  alwaysVisible?: boolean;
}

export interface RefInputText {
    input: RefObject<HTMLInputElement> | RefObject<HTMLTextAreaElement>;
  }
  
  export interface InputTextProps {
    id?: string;
    name?: string;
    title?: string;
    withLabel?: boolean;
    value?: string;
    setValue?: React.Dispatch<React.SetStateAction<string>>;
    className?: string;
    classNameBg?: string;
    minLength?: number;
    maxLength?: number;
    readOnly?: boolean;
    disabled?: boolean;
    required?: boolean;
    autoComplete?: string;
    withTranslation?: boolean;
    translationParams?: string[];
    placeholder?: string;
    pattern?: string;
    rows?: number;
    button?: ReactNode;
    lowercase?: boolean;
    uppercase?: boolean;
    type?: string;
    darkMode?: boolean;
    hint?: ReactNode;
    help?: string;
    icon?: string;
    editor?: string; // monaco
    editorLanguage?: string; // "javascript" | "typescript" | "html" | "css" | "json";
    editorHideLineNumbers?: boolean;
    editorTheme?: "vs-dark" | "light";
    editorFontSize?: number;
    onBlur?: () => void;
    borderless?: boolean;
    editorSize?: "sm" | "md" | "lg" | "auto" | "full" | "screen";
    autoFocus?: boolean;
    isError?: boolean;
    isSuccess?: boolean;
  }

function HintTooltip({ text, alwaysVisible }: HintTooltipProps) {
  return (
    <div className="group relative flex flex-col items-center">
      {!alwaysVisible && (
        <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <div className={cn(alwaysVisible ? "" : "hidden", "absolute bottom-0 mb-6 w-40 flex-col items-center group-hover:flex sm:w-72 md:w-96")}>
        <span className="whitespace-no-wrap relative z-10 bg-black p-2 text-xs leading-none text-white shadow-lg">{text}</span>
        <div className="-mt-2 h-3 w-3 rotate-45 bg-black"></div>
      </div>
    </div>
  );
}

function EntityIcon({ className, icon, title }: { className?: string; icon?: string; title?: string }) {
    return (
      <>
        {icon && (
          <>
            {icon.startsWith("<svg") ? (
              <div dangerouslySetInnerHTML={{ __html: icon.replace("<svg", `<svg class='${className}'`) ?? "" }} />
            ) : icon.includes("http") ? (
              <img className={className} src={icon} alt={title} />
            ) : (
              <></>
            )}
          </>
        )}
      </>
    );
}


const InputText = (
  {
    id,
    name,
    title,
    withLabel = true,
    value,
    setValue,
    className,
    classNameBg,
    help,
    disabled = false,
    readOnly = false,
    required = false,
    minLength,
    maxLength,
    autoComplete,
    withTranslation = false,
    translationParams = [],
    placeholder,
    pattern,
    hint,
    rows,
    button,
    lowercase,
    uppercase,
    type = "text",
    darkMode,
    icon,
    editor,
    editorLanguage,
    editorHideLineNumbers,
    editorTheme = "vs-dark",
    editorFontSize,
    onBlur,
    borderless,
    editorSize = "sm",
    autoFocus,
    isError,
    isSuccess,
  }: InputTextProps,
  ref: Ref<RefInputText>
) => {
  const [actualValue, setActualValue] = useState<string>(value ?? "");

  useEffect(() => {
    setActualValue(value ?? "");
  }, [value]);

  useEffect(() => {
    if (onChange) {
      onChange(actualValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualValue]);

  useImperativeHandle(ref, () => ({ input }));
  const input = useRef<HTMLInputElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);

  function onChange(value: string) {
    if (setValue) {
      if (lowercase) {
        setValue(value.toLowerCase());
      } else if (uppercase) {
        setValue(value.toUpperCase());
      } else {
        setValue(value);
      }
    }
  }

  return (
    <div className={cn(className, !darkMode && "text-gray-800")}>
      {withLabel && (
        <label htmlFor={name} className="mb-1 flex justify-between space-x-2 truncate text-xs font-medium text-gray-600">
          <div className="flex items-center space-x-1 truncate">
            <div className="flex space-x-1 truncate">
              <div className="truncate">{title}</div>
              {required && <div className="ml-1 text-red-500">*</div>}
            </div>
            <div className="">{help && <HintTooltip text={help} />}</div>
          </div>
          {hint}
        </label>
      )}
      <div className={cn("relative flex w-full rounded-md")}>
        {editor === "monaco" && editorLanguage ? (
          <>
            <textarea hidden readOnly name={name} value={actualValue} />
            <Editor
              theme={editorTheme}
              className={cn(
                "block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-accent-500 focus:ring-accent-500 sm:text-sm",
                editorSize === "sm" && "h-32",
                editorSize === "md" && "h-64",
                editorSize === "lg" && "h-96",
                editorSize === "auto" && "h-auto",
                editorSize === "full" && "h-full",
                editorSize === "screen" && "h-screen",
                className,
                classNameBg,
                editorHideLineNumbers && "-ml-10",
                borderless && "border-transparent"
              )}
              defaultLanguage={editorLanguage}
              language={editorLanguage}
              options={{
                fontSize: editorFontSize,
                renderValidationDecorations: "off",
              }}
              value={actualValue}
              onChange={(e) => setActualValue(e?.toString() ?? "")}
            />
          </>
        ) : !rows ? (
          <>
            {icon && (
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <EntityIcon className="h-5 w-5 text-gray-400" icon={icon} />
              </div>
            )}
            <input
              ref={input}
              type={type}
              id={id ?? name}
              name={name}
              autoComplete={autoComplete}
              required={required}
              minLength={minLength}
              maxLength={maxLength}
              // defaultValue={value}
              value={actualValue}
              onChange={(e) => setActualValue(e.currentTarget.value)}
              onBlur={onBlur}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              pattern={pattern !== "" && pattern !== undefined ? pattern : undefined}
              autoFocus={autoFocus}
              className={cn(
                "block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-accent-500 focus:ring-accent-500 sm:text-sm",
                className,
                classNameBg,
                disabled || readOnly ? "cursor-not-allowed bg-gray-100" : "hover:bg-gray-50 focus:bg-gray-50",
                icon && "pl-10",
                borderless && "border-transparent",
                isError && "border-red-300 bg-red-100 text-red-900",
                isSuccess && "bg-real-100 border-real-300 text-real-900"
              )}
            />
            {button}
          </>
        ) : (
          <textarea
            rows={rows}
            ref={textArea}
            id={id ?? name}
            name={name}
            autoComplete={autoComplete}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            // defaultValue={value}
            value={actualValue}
            onChange={(e) => setActualValue(e.currentTarget.value)}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={cn(
              "block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-accent-500 focus:ring-accent-500 sm:text-sm",
              className,
              classNameBg,
              disabled || readOnly ? "cursor-not-allowed bg-gray-100" : "hover:bg-gray-50 focus:bg-gray-50",
              borderless && "border-transparent",
              isError && "border-red-300 bg-red-100 text-red-900",
              isSuccess && "bg-real-100 border-real-300 text-real-900"
            )}
          />
        )}
      </div>
    </div>
  );
};
export default forwardRef(InputText);