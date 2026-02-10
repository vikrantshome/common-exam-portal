import type { UserProfile } from "../hooks/useAuth";

// Types for the Smart Map
export type SmartMapField = {
  selector: string;
  source: string | string[] | boolean; // Can be single path, array, or boolean (for checkboxes)
  separator?: string; // e.g. " " for full name
  confidence: number;
  mapping?: Record<string, string>; // e.g. { "MALE": "M" }
  format?: string; // e.g. "YYYY-MM-DD"
  actions?: SmartAction[]; // Agentic Action Plan
};

export type SmartAction = {
  type: 'click' | 'type' | 'key' | 'wait';
  selector?: string;
  value?: string;
  code?: string;
  duration?: number;
};

export type SmartMap = {
  fields: SmartMapField[];
};

/**
 * Dedicated Executor for Low-Level DOM Actions
 * Handles the nuances of simulating user interaction.
 */
class ActionExecutor {
  static async execute(action: SmartAction, resolvedValue: string) {
    if (action.type === 'wait') {
        await new Promise(r => setTimeout(r, action.duration || 500));
        return;
    }

    const selector = action.selector;
    if (!selector) return;

    const element = document.querySelector(selector) as HTMLElement;
    if (!element) {
        console.warn(`Action target not found: ${selector}`);
        return;
    }

    console.log(`[ActionExecutor] ${action.type} on ${selector}`, action);

    switch (action.type) {
        case 'click':
            this.simulateClick(element);
            await new Promise(r => setTimeout(r, 100)); // Short UI settling
            break;
        
        case 'type':
            // Interpolate value: "{value}" -> "Male"
            const textToType = action.value === '{value}' ? resolvedValue : (action.value || '');
            await this.simulateType(element, textToType);
            break;

        case 'key':
            const key = action.code || 'Enter';
            this.simulateKeyPress(element, key);
            break;
    }
  }

  private static simulateClick(element: HTMLElement) {
      element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
      element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
      element.click();
      element.focus();
  }

  private static async simulateType(element: HTMLElement, text: string) {
      element.focus();
      
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
          // React 16+ Value Setter Hack (for controlled components)
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
          if (nativeInputValueSetter) {
              nativeInputValueSetter.call(element, text);
          } else {
              element.value = text;
          }
          
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
          // ContentEditable or custom divs
          element.innerText = text;
          element.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      await new Promise(r => setTimeout(r, 50));
  }

  private static simulateKeyPress(element: HTMLElement, key: string) {
      element.dispatchEvent(new KeyboardEvent('keydown', { key, code: key, bubbles: true }));
      element.dispatchEvent(new KeyboardEvent('keypress', { key, code: key, bubbles: true }));
      element.dispatchEvent(new KeyboardEvent('keyup', { key, code: key, bubbles: true }));
      
      if (key === 'Enter') {
          element.dispatchEvent(new Event('change', { bubbles: true }));
          element.dispatchEvent(new Event('blur', { bubbles: true }));
      }
  }
}

export class FormFiller {
  
  /**
   * Main Entry Point: Execute a Smart Map against a User Profile
   */
  static async execute(map: SmartMap, user: UserProfile) {
    console.log("🚀 Executing Smart Map...", map);
    
    // Process sequentially to avoid race conditions in UI interactions
    for (const field of map.fields) {
      await this.fillField(field, user);
      // Small delay between fields to allow UI to settle (Fixes cascading dropdowns)
      await new Promise(r => setTimeout(r, 500));
    }
  }

  private static async fillField(field: SmartMapField, user: UserProfile) {
      // 1. Resolve Value
      const rawValue = this.resolveValue(field.source, user, field.separator);
      
      if (!rawValue && field.source !== true) { // Allow checkboxes that don't need source
        console.warn(`Skipping ${field.selector}: No value found for ${field.source}`);
        return;
      }

      // 2. Transform Value
      const finalValue = rawValue ? this.transformValue(rawValue, field) : "";

      // 3. Agentic Execution (If actions defined)
      if (field.actions && field.actions.length > 0) {
          console.log(`🤖 Agentic Execution for ${field.selector}`);
          for (const action of field.actions) {
              await ActionExecutor.execute(action, finalValue);
          }
          return; // Done
      }

      // 4. Standard Execution (Fallback)
      const element = document.querySelector(field.selector) as HTMLElement;
      if (!element) {
        console.warn(`Element not found: ${field.selector}`);
        return;
      }
      this.inject(element, finalValue, field);
  }

  /**
   * Helper to get nested value (e.g. user["profile"]["firstName"])
   * Supports Array sources for composite fields.
   */
  private static resolveValue(path: string | string[] | boolean, user: any, separator: string = " "): string | undefined {
    // Checkbox special case
    if (path === true) return "true";
    if (typeof path === 'boolean') return path ? "true" : "false";

    // A. Handle Composite Fields (Array)
    if (Array.isArray(path)) {
       const values = path.map(p => this.resolveSingleValue(p, user)).filter(v => v !== undefined && v !== null && v !== "");
       if (values.length === 0) return undefined;
       return values.join(separator);
    }
    
    // B. Handle Single Field
    return this.resolveSingleValue(path as string, user);
  }

  private static resolveSingleValue(path: string, user: any): string | undefined {
    return path.split('.').reduce((obj, key) => obj?.[key], user);
  }

  /**
   * Apply transformations like Enum Mapping or Date Formatting
   */
  private static transformValue(value: string, field: SmartMapField): string {
    // A. Enum Mapping (e.g. MALE -> M)
    if (field.mapping && field.mapping[value]) {
      return field.mapping[value];
    }

    // B. Date Formatting
    if (field.format && this.isDate(value)) {
      return this.formatDate(value, field.format);
    }

    return value;
  }

  private static inject(element: HTMLElement, value: string, field: SmartMapField) {
    const tagName = element.tagName.toLowerCase();
    const type = (element as HTMLInputElement).type;

    // --- 1. Date Splitting Logic for Selects ---
    if (tagName === 'select' && this.isDate(value)) {
        const date = new Date(value);
        const options = Array.from((element as HTMLSelectElement).options).map(o => ({ 
            text: o.text.trim().toLowerCase(), 
            value: o.value 
        }));

        const maxVal = options.reduce((max, o) => {
            const num = parseInt(o.text);
            return !isNaN(num) && num > max ? num : max;
        }, 0);

        let partToSelect = "";

        if (maxVal > 1900) {
            // Year
            partToSelect = date.getFullYear().toString();
        } else if (maxVal === 31) {
            // Day
            partToSelect = date.getDate().toString(); // 1-31
        } else if (maxVal === 12 || options.some(o => o.text.includes('jan'))) {
            // Month
            const monthIndex = date.getMonth(); // 0-11
            const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
            const monthShort = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
            
            const numericMatch = (monthIndex + 1).toString();
            const paddedMatch = (monthIndex + 1).toString().padStart(2, '0');
            
            const target = options.find(o => 
                o.value === numericMatch || o.text === numericMatch ||
                o.value === paddedMatch || o.text === paddedMatch ||
                o.text.includes(monthNames[monthIndex]) ||
                o.text.includes(monthShort[monthIndex])
            );
            
            if (target) {
                (element as HTMLSelectElement).value = target.value;
                this.dispatchEvents(element);
                this.highlight(element, 'success');
                return;
            }
        }

        if (partToSelect) {
             const target = options.find(o => o.text === partToSelect || o.value === partToSelect || o.text === partToSelect.padStart(2, '0'));
             if (target) {
                 (element as HTMLSelectElement).value = target.value;
                 this.dispatchEvents(element);
                 this.highlight(element, 'success');
                 return;
             }
        }
    }

    // --- 2. Radio / Checkbox ---
    if (tagName === 'input' && (type === 'radio' || type === 'checkbox')) {
      if ((element as HTMLInputElement).value === value) {
         (element as HTMLInputElement).checked = true;
      } else {
         const name = (element as HTMLInputElement).name;
         const specificInput = document.querySelector(`input[name="${name}"][value="${value}"]`) as HTMLInputElement;
         if (specificInput) {
             specificInput.checked = true;
             this.dispatchEvents(specificInput);
             this.highlight(specificInput, field.confidence > 0.8 ? 'success' : 'warning');
             return; 
         }
      }
    } 
    
    // --- 3. Standard Select Fuzzy Match (State/Country/Gender) ---
    else if (tagName === 'select') {
        const select = element as HTMLSelectElement;
        const normalizedValue = value.toLowerCase().trim();
        const options = Array.from(select.options);
        
        // Strategy 1: Exact Value Match (Case Sensitive)
        let match = options.find(o => o.value === value);
        
        // Strategy 2: Exact Text/Value Match (Case Insensitive)
        if (!match) {
            match = options.find(o => 
                o.text.trim().toLowerCase() === normalizedValue || 
                o.value.toLowerCase() === normalizedValue
            );
        }

        // Strategy 3: Word Boundary Match (e.g. "Male" matches "Male (01)" but NOT "Female")
        if (!match) {
            match = options.find(o => {
                const text = o.text.trim().toLowerCase();
                const regex = new RegExp(`\\b${normalizedValue}\\b`, 'i');
                return regex.test(text);
            });
        }

        // Strategy 4: Fallback "Includes" (Aggressive - use carefully)
        if (!match && normalizedValue.length > 3) {
             match = options.find(o => o.text.toLowerCase().includes(normalizedValue));
        }

        if (match) {
            select.value = match.value;
        } else {
            console.warn(`Could not find option for value: ${value}`);
        }
    }
    // --- 4. Standard Input ---
    else {
      (element as HTMLInputElement).value = value;
    }

    this.dispatchEvents(element);
    this.highlight(element, field.confidence > 0.8 ? 'success' : 'warning');
  }

  // --- Utilities ---

  private static isDate(value: string): boolean {
    return !isNaN(Date.parse(value)) && value.includes('-');
  }

  private static formatDate(isoString: string, format: string): string {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    if (format === 'DD/MM/YYYY') return `${day}/${month}/${year}`;
    if (format === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
    if (format === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
    
    return isoString.split('T')[0]; // Default ISO YYYY-MM-DD
  }

  static dispatchEvents(element: HTMLElement) {
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  static highlight(element: HTMLElement, status: 'success' | 'error' | 'warning') {
    element.style.transition = 'border 0.3s, background-color 0.3s';
    if (status === 'success') {
      element.style.border = '2px solid #22c55e'; // Green
      element.style.backgroundColor = '#f0fdf4';
    } else if (status === 'warning') {
      element.style.border = '2px solid #eab308'; // Yellow
      element.style.backgroundColor = '#fefce8';
    } else {
      element.style.border = '2px solid #ef4444'; // Red
    }
  }
}