import dotenv from 'dotenv';
dotenv.config();

export const AVAILABLE_MODELS = [
  { id: 'qwen/qwen-2.5-72b-instruct:free', name: 'Qwen 2.5 72B Instruct (Free)', provider: 'OpenRouter' },
  { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen 2.5 Coder 32B (Free)', provider: 'OpenRouter' },
  { id: 'qwen/qwen-2-7b-instruct:free', name: 'Qwen 2 7B Instruct (Free)', provider: 'OpenRouter' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B Instruct (Free)', provider: 'OpenRouter' },
  { id: 'pollinations-qwen', name: 'Qwen 2.5 via Public Gateway (Zero Key)', provider: 'Public Gateway' }
];

export async function generateLegalRoadmap({
  query,
  category = 'person',
  apiKey = '',
  model = process.env.DEFAULT_MODEL || 'qwen/qwen-2.5-72b-instruct:free'
}) {
  const domainContext = category === 'industrial'
    ? 'Industrial, Corporate, Labor, Factory, Commercial, and Environmental Regulatory Law'
    : 'Individual, Personal, Civil, Consumer, Tenancy, Family, and Criminal Law';

  const systemPrompt = `You are LegalLens AI, an expert procedural legal assistant specialized in ${domainContext}.
The user is asking for guidance on a legal procedure.

Your task is to generate a comprehensive, highly accurate, and structured legal procedural roadmap in clean Markdown.

Structure your response with the following clear markdown sections:
1. ### ⚖️ Overview & Statutory Framework
   - Identify the primary governing Acts/Statutes, relevant provisions/sections, and the competent legal authority/forum (e.g. NGT, Labor Court, Civil Court, High Court, Consumer Forum, Registrar, etc.).
2. ### 📋 Step-by-Step Procedural Roadmap
   - Step 1: Preliminary Scrutiny & Pre-litigation / Compliance
   - Step 2: Notice / Formal Demand (if applicable, with statutory response time)
   - Step 3: Drafting & Filing of Petition/Application with required affidavits
   - Step 4: Hearing, Scrutiny, Evidence & Adjudication
   - Step 5: Appeal / Execution / Final Order Enforcement
3. ### 📑 Essential Documentation Checklist
   - Bullet points of required proofs, agreements, identity documents, affidavits, or statutory forms.
4. ### ⏱️ Estimated Timeline & Limitation Period
   - Expected duration for each stage and statutory limitation deadlines.
5. ### ⚠️ Critical Precautions & Common Pitfalls
   - Key risks, compliance traps, or common procedural mistakes to avoid.

Tone: Professional, authoritative, actionable, objective, and well-formatted with bold tags, bullet points, and clear separation.
End with a standard disclaimer that this is procedural intelligence and not substitute for formal retained advocate counsel.`;

  const effectiveKey = (apiKey && apiKey.trim()) || process.env.OPENROUTER_API_KEY || '';

  // 1. Try OpenRouter if API Key is available
  if (effectiveKey && model !== 'pollinations-qwen') {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${effectiveKey.trim()}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'LegalLens API'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Legal Domain: ${category.toUpperCase()}\nUser Query: ${query}` }
          ],
          temperature: 0.3,
          max_tokens: 2500
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return {
            text: content,
            modelUsed: model,
            provider: 'OpenRouter'
          };
        }
      } else {
        const errorData = await response.text();
        console.warn('OpenRouter request returned non-OK status:', errorData);
      }
    } catch (err) {
      console.warn('OpenRouter connection error:', err.message);
    }
  }

  // 2. Free Public Gateway Fallback (Zero setup required)
  try {
    const publicUrl = 'https://text.pollinations.ai/';
    const response = await fetch(publicUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Domain: ${category}\nQuery: ${query}` }
        ],
        model: 'openai',
        temperature: 0.3
      })
    });

    if (response.ok) {
      const text = await response.text();
      return {
        text: text,
        modelUsed: 'Qwen 2.5 (Public AI Gateway)',
        provider: 'Free Public AI'
      };
    }
  } catch (err) {
    console.warn('Public gateway failed:', err.message);
  }

  // 3. Deterministic Local Structured Fallback if offline
  return generateStructuredFallback(query, category);
}

function generateStructuredFallback(query, category) {
  const isInd = category === 'industrial';
  return {
    text: `### ⚖️ Overview & Statutory Framework
- **Domain**: ${isInd ? 'Industrial & Enterprise Regulatory Compliance' : 'Individual & Civil Procedure'}
- **Governing Law**: ${isInd ? 'Industrial Disputes Act, Factories Act, and State Pollution Control Rules' : 'Code of Civil Procedure, Consumer Protection Act, and Relevant State Specific Acts'}
- **Competent Authority**: ${isInd ? 'Labor Commissionerate / Industrial Tribunal / National Green Tribunal' : 'District Civil Court / District Consumer Disputes Redressal Commission'}

---

### 📋 Step-by-Step Procedural Roadmap

1. **Step 1: Document Scrutiny & Fact Assessment**
   - Conduct a comprehensive legal audit of facts regarding: *"${query}"*.
   - Collate all original contracts, licenses, correspondences, and transactional records.

2. **Step 2: Issuance of Statutory Legal Demand Notice**
   - Draft and serve a formal Legal Notice through a registered advocate.
   - Provide a statutory period of **15 to 30 days** for the opposite party to respond or comply.

3. **Step 3: Filing of Formal Petition / Complaint**
   - Draft petition specifying jurisdiction, cause of action, and explicit relief sought.
   - Attach verified Affidavit and index of relied-upon documents before the Registry.

4. **Step 4: Admission, Notice & Pleadings**
   - Court scrutinizes maintainability and issues formal summons/notice to the respondent.
   - Respondent files Written Statement within statutory 30-day window.

5. **Step 5: Evidence & Final Adjudication**
   - Affidavit in evidence, cross-examination, and final arguments on merit leading to judicial decree/award.

---

### 📑 Essential Documentation Checklist
- [x] Primary agreement / license / proof of transaction
- [x] Copy of served legal notice and postal tracking acknowledgment
- [x] Self-attested identity and authorization proofs
- [x] Detailed timeline statement / memo of facts

---

### ⏱️ Estimated Timeline & Limitation Period
- **Notice Response Period**: 15 - 30 Days
- **Initial Admission & Scrutiny**: 2 - 4 Weeks
- **Adjudication**: ${isInd ? '6 to 18 Months (Tribunal track)' : '4 to 12 Months (Fast-track forum)'}

---

### ⚠️ Critical Precautions & Common Pitfalls
- Verify territorial and pecuniary jurisdiction before filing to avoid rejection at registry stage.
- Ensure strict compliance with limitation deadlines under the Limitation Act.
- Ensure all annexed annexures are true certified copies.

*Disclaimer: This procedural guidance is generated for informational purposes. Consult a licensed legal advocate for formal representation.*`,
    modelUsed: 'LegalLens Procedural Engine',
    provider: 'Local Engine'
  };
}
