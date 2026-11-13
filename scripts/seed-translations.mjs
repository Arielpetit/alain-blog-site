// Ajoute les traductions anglaises du contenu de démonstration.
// Prérequis : supabase/migrations/002_translations.sql exécuté (colonne i18n).
// Usage : npm run seed:en
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

const profileEn = {
  title: "Doctor of Public Law · Lecturer and researcher",
  tagline: "Thinking about law, informing public action.",
  institution: "Faculty of Law and Political Science",
  bioShort:
    "Legal scholar and lecturer, my work focuses on constitutional law, fundamental rights and public governance in Africa. This site brings together my publications, analyses and talks.",
  bioLong:
    "I hold a doctorate in public law and teach constitutional law, administrative law and civil liberties at the Faculty of Law.\n\nMy research focuses on **constitutional justice**, the **protection of fundamental rights** and **institutional reform** in French-speaking African states. In particular, I examine how constitutional courts contribute to democratic stability and to an effective rule of law.\n\nAlongside teaching, I advise public institutions and international organisations, and regularly speak at academic conferences.\n\nThrough this site, I aim to make the law more accessible: to the students discovering it, the practitioners applying it and the citizens living it every day.",
  stats: [
    { value: "15+", label: "Years of experience" },
    { value: "30+", label: "Scholarly publications" },
    { value: "40+", label: "Conferences and symposia" },
    { value: "1,200+", label: "Students taught" },
  ],
  expertise: [
    { title: "Constitutional law", description: "Constitutional justice, constitutional amendments, separation of powers and democratic transitions." },
    { title: "Fundamental rights", description: "Protection of civil liberties and regional human rights systems." },
    { title: "Administrative law", description: "Administrative litigation, state liability and decentralisation." },
    { title: "Public governance", description: "Institutional reform, transparency, accountability and quality of legislation." },
  ],
  education: [
    { period: "2010 – 2014", title: "PhD in Public Law", place: "University — Doctoral School of Law", description: "Thesis: “The constitutional judge and democratic consolidation in French-speaking Africa”. Highest distinction with the jury's congratulations." },
    { period: "2008 – 2009", title: "Research Master's — Fundamental Public Law", place: "University — Faculty of Law", description: "Dissertation on the constitutional review of organic laws." },
    { period: "2004 – 2008", title: "Bachelor's and Master's in Law", place: "University — Faculty of Law", description: "" },
  ],
  experience: [
    { period: "Since 2019", title: "Senior Lecturer", place: "Faculty of Law and Political Science", description: "Teaching constitutional law and civil liberties; supervising Master's dissertations." },
    { period: "Since 2017", title: "Legal consultant", place: "Public institutions and international organisations", description: "Expertise in legislative drafting, institutional reform and training of judicial actors." },
    { period: "2014 – 2019", title: "Lecturer", place: "Faculty of Law", description: "Tutorials, teaching support and participation in the research centre's projects." },
  ],
  distinctions: [
    { year: "2023", title: "Best scholarly contribution award", issuer: "African Association of Constitutional Law" },
    { year: "2018", title: "Postdoctoral research fellowship", issuer: "University cooperation programme" },
    { year: "2015", title: "Thesis prize", issuer: "Doctoral School of Law" },
  ],
};

const articles = {
  "juge-constitutionnel-gardien-de-la-democratie": {
    title: "Is the constitutional judge the guardian of democracy?",
    category: "Constitutional law",
    excerpt: "Election arbiter, protector of liberties, regulator of institutions: the constitutional judge plays a central role. But how far can the court go without overstepping its function?",
    content: `Since the democratic transitions of the 1990s, constitutional courts and councils have become major players in the political life of French-speaking Africa. They declare presidential election results, review the constitutionality of laws and settle disputes between branches of government. This new centrality makes them both a safeguard and a target.

## A considerably broader mission

Constitution-makers have entrusted the constitutional judge with three main functions, each of which directly affects the democratic balance:

1. **Reviewing legislation** — ensuring that statutes comply with the Constitution and, increasingly, with the State's international commitments;
2. **Regulating institutions** — settling disputes over powers between the executive, Parliament and other constitutional bodies;
3. **Electoral litigation** — guaranteeing the integrity of the vote and declaring final results.

Each of these functions exposes the judge to considerable political pressure, particularly during election periods.

## The conditions of legitimacy

> The legitimacy of the constitutional judge cannot be decreed: it is built decision by decision.

Three elements seem decisive to me: the statutory independence of its members, rigorous reasoning in its decisions, and access for citizens, notably through the plea of unconstitutionality.

## The risks of activism… and of restraint

The judge may be tempted to stand in for the constitution-maker by deriving unwritten principles; conversely, it may hide behind a literal reading of the texts to avoid ruling. Both attitudes weaken its authority. The right path lies in **coherent and predictable case law**.

## Conclusion

The constitutional judge is not, on its own, the guardian of democracy. It is one of its pillars — provided that the others, a free press, an active civil society and an effective Parliament, also play their part.`,
  },
  "exception-inconstitutionnalite-guide-pratique": {
    title: "The plea of unconstitutionality: a practical guide for litigants",
    category: "Law explained",
    excerpt: "How can a citizen challenge a law they believe breaches the Constitution? A step-by-step explanation of a mechanism that is still too little known.",
    content: `The plea of unconstitutionality allows any party to proceedings to argue that a statutory provision applicable to their case infringes rights and freedoms guaranteed by the Constitution.

## Who can raise it?

Any party to a dispute, before any court: civil, criminal, administrative, commercial or employment. You do not need to be a lawyer to raise it, although legal assistance is strongly recommended.

## How to proceed

- Raise the plea **in writing**, in a separate, reasoned submission;
- Identify precisely the contested provision;
- Show how it breaches a constitutionally guaranteed right or freedom;
- Establish that the provision **applies to the dispute**.

The court then stays the proceedings and refers the question to the constitutional court.

## What effects?

If the Court declares the provision unconstitutional, it can no longer be applied. Beyond the individual case, **the decision benefits everyone**.

> This mechanism makes every citizen an active guardian of the Constitution.`,
  },
  "decentralisation-et-libre-administration": {
    title: "Decentralisation: local self-government put to the test",
    category: "Administrative law",
    excerpt: "Enshrined in most constitutions, the principle of local self-government still struggles to deliver its full effects. An analysis of the legal and financial obstacles.",
    content: `The principle of local self-government appears in almost every constitution in French-speaking Africa. Yet three decades after the first decentralisation laws, its effectiveness remains limited.

## An ambitious legal framework

Decentralisation laws provide for significant transfers of powers: basic education, primary healthcare, civil registration and local planning.

## Persistent obstacles

- **Financial**: transfers of resources do not keep pace with transfers of powers;
- **Human**: local authorities lack qualified staff;
- **Legal**: administrative supervision often remains a disguised review of expediency.

## Avenues for reform

> Decentralising is not only about transferring powers: it is about trust.

A genuine equalisation fund, an attractive local civil service and *ex post* judicial review of legality would be decisive steps forward.`,
  },
  "reussir-son-commentaire-arret": {
    title: "Writing a successful case commentary: method and tips",
    category: "Teaching",
    excerpt: "Dreaded by law students, the case commentary follows a precise method. Here are the essential steps to master it.",
    content: `A case commentary is not a summary of the decision: it is a **critical analysis** that places the ruling within positive law.

## 1. Read and understand

Read the decision at least three times. Identify the facts, the procedure, the parties' claims, the legal question and the solution.

## 2. The case brief

This is the foundation of your introduction: facts, procedure, arguments, legal issue and ruling.

## 3. Build the outline

The two-part, two-subpart structure remains the norm. It should reflect the **meaning**, **value** and **scope** of the decision.

## 4. Write

- A complete introduction ending with the outline;
- Introductory paragraphs and careful transitions;
- No mandatory conclusion, though an opening can be appreciated.

> Quote the decision. A commentary that drifts away from it becomes an essay.`,
  },
  "cour-africaine-droits-homme-bilan": {
    title: "The African Court on Human Rights: an assessment after twenty years",
    category: "Fundamental rights",
    excerpt: "Established in 2006, the African Court on Human and Peoples' Rights has delivered landmark rulings. But withdrawals of declarations are weakening its work.",
    content: `The African Court on Human and Peoples' Rights complements the protective mandate of the African Commission. Twenty years on, its record is mixed but instructive.

## Progress in case law

The Court has developed ambitious case law on fair trial rights, freedom of expression, electoral rights and the rights of indigenous peoples.

## Access under threat

Direct access for individuals and NGOs requires a special declaration by the State. Several States have withdrawn it in recent years.

> A court that cannot be seized is a court that slowly fades away.

## Implementation, the Achilles' heel

Full compliance with judgments remains low. Strengthening follow-up mechanisms is the priority for the decade ahead.`,
  },
  "protection-donnees-personnelles-afrique": {
    title: "Personal data protection: where does Central Africa stand?",
    category: "Fundamental rights",
    excerpt: "Mobile phones, biometric ID, e-payments: personal data is everywhere. Are the region's laws up to the task?",
    content: `The digital transformation of the continent is accelerating: mobile payments, biometric identity, online public services. Each use generates personal, often sensitive, data.

## A regional framework under construction

The African Union Convention on Cyber Security and Personal Data Protection (the Malabo Convention) sets a common foundation.

## Uneven national legislation

- Some States have a complete law and an operational supervisory authority;
- Others have adopted a law without setting up the authority;
- Others still have no specific legislation.

## Priority issues

1. **Independence of supervisory authorities**;
2. **International data transfers**, notably to cloud providers;
3. **Raising citizens' awareness** of their rights.

> Protecting data means protecting people.`,
  },
};

const publications = {
  "Le juge constitutionnel et la consolidation démocratique en Afrique francophone": { title: "The constitutional judge and democratic consolidation in French-speaking Africa", venue: "Doctoral thesis in public law, University", abstract: "This thesis examines the role of constitutional courts in democratic consolidation, through a comparative study of ten French-speaking African states between 1990 and 2013." },
  "Justice constitutionnelle et contentieux électoral : essai de systématisation": { title: "Constitutional justice and electoral litigation: towards a systematic approach", venue: "African Public Law Review, no. 12, pp. 45-78", abstract: "The article proposes an analytical framework for electoral rulings and highlights the implicit criteria used by judges to assess the integrity of elections." },
  "Manuel de droit constitutionnel et institutions politiques": { title: "Handbook of constitutional law and political institutions", venue: "University Press, 2nd edition, 412 pp.", abstract: "Textbook for undergraduate students covering the general theory of the State, comparative political systems and national institutions." },
  "La protection des données personnelles en Afrique centrale : état des lieux": { title: "Personal data protection in Central Africa: an overview", venue: "Digital Law Review, no. 3, pp. 9-31", abstract: "Comparative study of national legislation and supervisory authorities in six states of the region." },
  "La protection des droits fondamentaux par le juge administratif": { title: "The protection of fundamental rights by the administrative judge", venue: "in Essays in honour of a public law scholar, pp. 211-236", abstract: "Chapter on the development of urgent procedures and their use by administrative courts." },
  "Les révisions constitutionnelles en Afrique : entre adaptation et instrumentalisation": { title: "Constitutional amendments in Africa: between adaptation and manipulation", venue: "Annals of the Faculty of Law, vol. 8, pp. 101-130", abstract: "Study of constitutional amendment procedures and the substantive limits set by constitution-makers." },
  "La décentralisation au service du développement local": { title: "Decentralisation for local development", venue: "International conference on local governance, Dakar", abstract: "Paper setting out the legal conditions for effective decentralisation." },
  "Rapport sur l'accès à la justice en zone rurale": { title: "Report on access to justice in rural areas", venue: "Expert report for a cooperation programme", abstract: "Assessment of the barriers to accessing courts and operational recommendations." },
  "L'exception d'inconstitutionnalité : bilan d'une décennie": { title: "The plea of unconstitutionality: a ten-year review", venue: "Comparative Law Review, no. 4, pp. 12-34", abstract: "Statistical and qualitative analysis of pleas of unconstitutionality raised before national courts." },
  "Le statut des juges constitutionnels : garanties et limites": { title: "The status of constitutional judges: safeguards and limits", venue: "Constitutional law study days, Brazzaville", abstract: "Comparative analysis of appointment procedures and statutory safeguards for constitutional court members." },
};

const conferences = {
  "L'avenir de la justice constitutionnelle en Afrique": { title: "The future of constitutional justice in Africa", event: "Congress of the African Association of Constitutional Law", location: "Abidjan, Côte d'Ivoire", role: "Keynote speaker", description: "Opening lecture on the challenges facing constitutional justice during political transitions." },
  "Droits numériques et libertés publiques": { title: "Digital rights and civil liberties", event: "Faculty of Law research days", location: "Brazzaville, Congo", role: "Panellist", description: "Round table on personal data protection and online freedom of expression." },
  "Contentieux électoral : bonnes pratiques": { title: "Electoral litigation: good practice", event: "Judicial training workshop", location: "Kinshasa, DRC", role: "Speaker", description: "Training module on the role of the electoral judge and the reasoning of decisions." },
  "Gouvernance locale et décentralisation": { title: "Local governance and decentralisation", event: "International conference on local governance", location: "Dakar, Senegal", role: "Keynote speaker", description: "Paper on the legal conditions for effective decentralisation." },
  "Les droits de l'homme à l'épreuve des crises": { title: "Human rights in times of crisis", event: "Regional seminar of national human rights institutions", location: "Yaoundé, Cameroon", role: "Moderator", description: "Chairing the panel on states of emergency and civil liberties." },
  "Méthodologie de la recherche en droit": { title: "Legal research methodology", event: "Doctoral school — PhD seminar", location: "Brazzaville, Congo", role: "Speaker", description: "Seminar on framing a research question and using sources in a law thesis." },
};

const { data: row } = await sb.from("dr_profile").select("data").eq("id", 1).single();
if (row) {
  const { error } = await sb.from("dr_profile").update({ data: { ...row.data, en: profileEn } }).eq("id", 1);
  console.log(error ? `✗ profil : ${error.message}` : "✓ profil (en)");
}

async function translate(table, key, map) {
  const { data, error } = await sb.from(table).select(`id, ${key}, i18n`);
  if (error) {
    console.error(`✗ ${table} : ${error.message}`);
    if (error.message.includes("i18n")) console.error("  → Exécutez supabase/migrations/002_translations.sql puis relancez.");
    return;
  }
  let n = 0;
  for (const r of data) {
    const en = map[r[key]];
    if (!en) continue;
    const { error: e } = await sb.from(table).update({ i18n: { ...(r.i18n ?? {}), en } }).eq("id", r.id);
    if (e) console.error(`✗ ${table} ${r[key]} : ${e.message}`);
    else n++;
  }
  console.log(`✓ ${table} : ${n} traduction(s)`);
}

await translate("dr_articles", "slug", articles);
await translate("dr_publications", "title", publications);
await translate("dr_conferences", "title", conferences);
