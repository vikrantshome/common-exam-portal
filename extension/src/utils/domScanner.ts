// The "Skeleton" that will be sent to AI
export type SkeletonField = {
  id: string;
  name: string;
  type: string;
  label: string;
  value?: string;
  role?: string; // ARIA role (e.g. "combobox")
  options?: { label: string; value: string }[];
  section?: string;
  selector: string;
  parentSelector?: string; // For complex components, the wrapper ID
  interactionType?: 'standard' | 'complex' | 'hidden';
  interactiveSelector?: string; // The thing to click/type into
};

export class DomScanner {
  static scan(): SkeletonField[] {
    // Helper: Check if element is visible OR is a hidden "Rich Select" (Chosen/Select2)
    const isVisible = (el: HTMLElement): boolean => {
       if (!el) return false;
       
       // Standard visibility
       const visible = !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
       if (visible) return true;

       // Exception: Rich UI Selects (Chosen, Select2) often hide the real select
       if (el.tagName === 'SELECT') {
           if (el.classList.contains('chosen-select') || el.classList.contains('select2-hidden-accessible')) return true;
           // Check for sibling container
           const next = el.nextElementSibling;
           if (next && (next.classList.contains('chosen-container') || next.classList.contains('select2-container'))) return true;
       }

       return false;
    };

    // Helper to find nearest section header
    const getContext = (el: Element): string => {
      let current: Element | null = el.parentElement;
      while (current && current !== document.body) {
        // Priority 1: Dialog/Modal Header
        if (current.getAttribute('role') === 'dialog' || current.classList.contains('modal') || current.classList.contains('popup')) {
             const dialogTitle = current.querySelector('h1, h2, h3, h4, .modal-title, .dialog-title');
             if (dialogTitle) return (dialogTitle as HTMLElement).innerText.trim();
             // Check aria-labelledby
             const labelledBy = current.getAttribute('aria-labelledby');
             if (labelledBy) {
                 const labelEl = document.getElementById(labelledBy);
                 if (labelEl) return labelEl.innerText.trim();
             }
             return "Popup Window";
        }

        // Priority 2: Standard Section Header
        const header = current.querySelector('h1, h2, h3, h4, legend, .card-title, .section-header');
        if (header) return (header as HTMLElement).innerText.trim();
        current = current.parentElement;
      }
      return "General";
    };

    // Helper to find label text
    const getLabel = (el: Element): string => {
      let labelText = "No Label";
      // 1. Explicit Label tag
      if ((el as HTMLInputElement).labels && (el as HTMLInputElement).labels?.length) {
        return (el as HTMLInputElement).labels![0].innerText.trim();
      }
      // 2. ID matching
      if (el.id) {
        const labelEl = document.querySelector(`label[for="${el.id}"]`);
        if (labelEl) return (labelEl as HTMLElement).innerText.trim();
      }
      // 3. Proximity / Parent
      let parent = el.parentElement;
      while (parent && parent !== document.body) {
         // Stop if we went too far up
         if (parent.tagName === 'FORM' || parent.tagName === 'SECTION') break;
         
         // Look for a label or strong text in parent
         const label = parent.querySelector('label, .form-label, .label');
         if (label) return (label as HTMLElement).innerText.trim();
         
         // Or just the text of the parent if it's small (like a wrapper div)
         if (parent.innerText.length < 100) {
             return parent.innerText.replace((el as any).value || '', '').trim().split('\n')[0];
         }
         parent = parent.parentElement;
      }
      return labelText;
    };

    const fields: SkeletonField[] = [];

    // 1. Scan Standard Inputs
    const inputs = document.querySelectorAll("input, select, textarea");
    const processedMap = new Set<string>(); // Keep track of elements we've already mapped

    inputs.forEach((el: any) => {
        // Ignore submits/buttons
        if (el.type === 'submit' || el.type === 'button' || el.type === 'image') return;
        
        // VISIBILITY CHECK: Ignore hidden inputs (unless type="hidden")
        if (el.type !== 'hidden' && !isVisible(el)) return;

        // Generate a unique key for the element to avoid duplicates
        const elKey = el.name || el.id || '';
        if (elKey && processedMap.has(elKey)) return;

        // Special handling for Hidden Inputs (often carrying the value for React Selects)
        if (el.type === 'hidden') {
            // Only care if it has a name (likely a form field)
            if (!el.name) return;
            
            // Try to find the "Visual" counterpart (React-Select Strategy)
            let parent = el.parentElement;
            let visualRole = 'hidden';
            let wrapperSelector = "";
            let interactiveSelector = "";
            let foundCombobox = false;
            
            // Check up to 4 levels up for a container
            for(let i=0; i<4; i++) {
                if(!parent || parent === document.body) break;
                
                // Detection Logic: Look for ARIA roles
                const combobox = parent.querySelector('[role="combobox"]');
                // Also check if the parent ITSELF is a combobox (some implementations)
                const isParentCombobox = parent.getAttribute('role') === 'combobox';
                const targetCombobox = isParentCombobox ? parent : combobox;

                if (targetCombobox) {
                    // Important: Check if the VISIBLE part is actually visible
                    if (!isVisible(targetCombobox as HTMLElement)) {
                        // If the interactive part is hidden, this whole field is likely hidden
                        return;
                    }

                    visualRole = 'combobox'; 
                    foundCombobox = true;
                    
                    // The wrapper is the parent we found
                    wrapperSelector = parent.id ? `#${parent.id}` : (parent.className ? `.${parent.className.split(' ')[0]}` : '');
                    
                    // The interactive part is the combobox
                    if (targetCombobox.id) {
                        interactiveSelector = `#${targetCombobox.id}`;
                    } else {
                        // Fallback to specific attribute or structure
                        interactiveSelector = `${wrapperSelector} [role="combobox"]`;
                    }
                    break;
                }
                parent = parent.parentElement;
            }

            // If it's just a raw hidden input with no visible combobox, we usually skip it 
            // unless we want to support pure hidden fields (rare for auto-fill)
            // But let's keep it if we found a combobox OR if we want to be permissive.
            // For now, let's strictly require it to be a Complex Field OR a standard hidden field?
            // Actually, hidden fields often track state we don't want to touch.
            // Let's only map it if foundCombobox is true.
            if (!foundCombobox) return;

            fields.push({
                id: el.id,
                name: el.name,
                type: 'hidden',
                label: getLabel(el), // Attempt to find label even for hidden
                role: visualRole, // 'combobox' hints AI to look for interaction steps
                parentSelector: wrapperSelector,
                interactiveSelector: interactiveSelector, // This is what needs to be clicked/typed in
                value: el.value,
                section: getContext(el),
                selector: `input[name="${el.name}"]`, // The hidden input (source of truth for value)
                interactionType: foundCombobox ? 'complex' : 'hidden'
            });
            processedMap.add(elKey);
            return;
        }

        // Standard Fields
        let options: { label: string; value: string }[] | undefined = undefined;
        if (el.tagName === 'SELECT') {
            options = Array.from(el.options).map((opt: any) => ({
                label: opt.innerText,
                value: opt.value
            }));
        }

        let selector = el.tagName.toLowerCase();
        if (el.id) selector += `#${el.id}`;
        else if (el.name) selector += `[name="${el.name}"]`;

        fields.push({
            id: el.id,
            name: el.name,
            type: el.type,
            label: getLabel(el),
            value: el.value,
            options,
            section: getContext(el),
            selector,
            interactionType: 'standard'
        });
        processedMap.add(elKey);
    });

    // 2. Scan "Orphaned" Comboboxes (No Hidden Input found)
    // Sometimes the combobox IS the input (no hidden field)
    const comboboxes = document.querySelectorAll('[role="combobox"]');
    comboboxes.forEach((el: any) => {
        // VISIBILITY CHECK
        if (!isVisible(el)) return;

        // Check if this combobox was already "claimed" by a hidden input
        // This is hard because we tracked the HIDDEN input in processedMap.
        // We need to check if this element is inside a wrapper we already processed?
        // Simpler: Just check if it has a name/id that we haven't seen.
        
        // If it mimics a select, it might have a name
        const elKey = el.getAttribute('name') || el.id;
        // If no name/id, we can't reliably map it anyway without a lot of pain.
        if (!elKey) return; 
        
        // If we already processed a field with this name (likely the hidden one), skip.
        if (processedMap.has(elKey)) return;
        
        // Check if we already processed a hidden input that POINTS to this interactive selector
        // This is O(N*M) but N is small.
        const alreadyClaimed = fields.some(f => f.interactiveSelector && (f.interactiveSelector.includes(el.id) || f.interactiveSelector === elKey));
        if (alreadyClaimed) return;

        fields.push({
            id: el.id,
            name: el.getAttribute('name') || '',
            type: 'combobox',
            label: getLabel(el),
            value: el.value || el.innerText,
            section: getContext(el),
            selector: el.id ? `#${el.id}` : `[role="combobox"][name="${el.getAttribute('name')}"]`,
            interactionType: 'complex',
            role: 'combobox',
            interactiveSelector: el.id ? `#${el.id}` : undefined
        });
    });

    // 2. Scan "ARIA Comboboxes" (The visual part of React Select)
    // We only capture these if they are ORPHANED (not linked to a hidden input we already found)
    // This reduces noise.
    
    // ... Actually, for safety, let's capture them but mark them.
    // The previous hidden input scan logic captures the link.
    // So we don't need to double-scan comboboxes unless we missed the hidden input.

    const uniqueFields = fields.filter((f, index, self) => 
      index === self.findIndex((t) => (
        t.selector === f.selector && t.type === f.type
      ))
    );

    return uniqueFields;
  }
}
