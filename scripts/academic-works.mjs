// Thèse de doctorat et mémoires de Master du Dr Alain Bienvenu Gnassoumari.
// Usage : node --env-file=.env.local scripts/academic-works.mjs <these.pdf> <memoire-douala.pdf> <memoire-pssfp.pdf>
// Téléverse les PDF dans Supabase Storage puis ajoute / met à jour les publications (par titre).
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } });

export const works = [
  {
    file: "publications/these-controle-patrimonial-finances-publiques-gnassoumari.pdf",
    row: {
      title: "Le contrôle patrimonial des finances publiques : contribution à l'évolution du contrôle des finances publiques camerounaises",
      authors: "A. B. Gnassoumari",
      type: "these",
      venue: "Thèse de doctorat (Ph.D) en droit public — Université de Dschang, École doctorale, 2024-2025 ; codirection : Pr Célestin Sietchoua Djuitchoko et Pr Gaëtan Begni Bagagna",
      year: 2025,
      abstract:
        "Traditionnellement, l'exécution des finances publiques est soumise à des contrôles visant à garantir la régularité et la performance des opérations budgétaires et financières. Ces contrôles s'accompagnent désormais d'un contrôle des opérations portant sur le patrimoine public, conformément au décret de 2020 sur la comptabilité publique et à celui de 2013 sur le contrôle administratif des finances publiques. Cette thèse analyse le contrôle patrimonial pour en cerner la dynamique d'évolution : au vu de la réforme, ce contrôle a-t-il évolué ? Il apparaît qu'il est en plein essor, à travers les avancées du contrôle exercé par le Parlement, l'administration et le juge. Le Parlement dispose d'instruments juridiques pour contrôler l'acquisition, l'usage et la gestion des biens publics ; l'administration tient un inventaire de ses biens et enregistre les mouvements de son patrimoine grâce à la comptabilité patrimoniale. Le juge des comptes et le juge répressif sont devenus des acteurs incontournables de la protection du patrimoine public, le juge pénal dominant en raison de ses pouvoirs étendus. Ces niveaux complémentaires marquent une étape importante de l'évolution du contrôle patrimonial des finances publiques camerounaises.",
      link: "",
      featured: true,
      i18n: {
        en: {
          title: "Patrimonial control of public finances: a contribution to the evolution of public finance control in Cameroon",
          venue: "Doctoral thesis (PhD) in Public Law — University of Dschang, Doctoral School, 2024-2025; co-supervised by Prof. Célestin Sietchoua Djuitchoko and Prof. Gaëtan Begni Bagagna",
          abstract:
            "Traditionally, the execution of public finances is subject to controls designed to ensure the regularity and performance of budgetary and financial operations. These controls are now accompanied by control of operations relating to public property, in line with the 2020 decree on public accounting and the 2013 decree on the administrative control of public finances. This thesis analyses patrimonial control to understand how it has evolved following the reform. It finds that such control is expanding through the action of Parliament, the administration and the courts. Parliament now has legal instruments to oversee the acquisition, use and management of public property; the administration keeps an inventory of its assets and records changes through accrual-based asset accounting. Audit judges and criminal courts have become key actors in protecting public property, with criminal courts playing the leading role. These complementary levels mark an important step in the evolution of patrimonial control of Cameroon's public finances.",
        },
      },
    },
  },
  {
    file: "publications/memoire-master2-sincerite-depense-publique-gnassoumari.pdf",
    row: {
      title: "Le contrôle de la sincérité de la dépense publique en droit financier camerounais",
      authors: "A. B. Gnassoumari",
      type: "these",
      venue: "Mémoire de Master II en droit public interne — Université de Douala, Faculté des sciences juridiques et politiques, 2020-2021 ; direction : Pr Begni Bagagna",
      year: 2021,
      abstract:
        "La sincérité, principe nouveau des finances publiques camerounaises, est une exigence consacrée par les normes financières de l'État. Ce mémoire s'interroge sur la typologie des modes de contrôle de la sincérité de la dépense publique en droit financier camerounais. L'analyse du droit positif et de la doctrine financière, camerounaise et étrangère, révèle une typologie duale. Le contrôle non juridictionnel traduit un renouveau des compétences du Parlement et des administrations chargées du contrôle. Le contrôle juridictionnel témoigne de la rénovation du cadre juridictionnel du contrôle de la dépense publique : la création du Tribunal criminel spécial (TCS) contre les détournements et l'ouverture du contentieux des ordonnateurs devant la juridiction des comptes illustrent la juridictionnalisation croissante des finances publiques au Cameroun.",
      link: "",
      featured: false,
      i18n: {
        en: {
          title: "Control of the sincerity of public expenditure in Cameroonian financial law",
          venue: "Master's dissertation (Master II) in Internal Public Law — University of Douala, Faculty of Law and Political Science, 2020-2021; supervised by Prof. Begni Bagagna",
          abstract:
            "Sincerity, a new principle of Cameroonian public finances, is a requirement enshrined in the State's financial rules. This dissertation examines the different ways in which the sincerity of public expenditure is controlled under Cameroonian financial law. Analysis of positive law and of Cameroonian and foreign financial doctrine reveals a dual typology. Non-judicial control reflects renewed powers for Parliament and the administrations responsible for oversight. Judicial control reflects the renewal of the judicial framework: the creation of the Special Criminal Court (TCS) to fight embezzlement and the opening of authorising officers' liability before the audit court illustrate the growing role of the courts in Cameroon's public finances.",
        },
      },
    },
  },
  {
    file: "publications/memoire-pssfp-gestion-matieres-minader-gnassoumari.pdf",
    row: {
      title: "Le contrôle de gestion matières et le contrôle de la dépense publique au Cameroun : cas du MINADER",
      authors: "A. B. Gnassoumari",
      type: "these",
      venue: "Mémoire de Master II professionnel en finances publiques, option Audit et contrôle — PSSFP, Université de Yaoundé II, 2022-2023 ; encadrement : Dr Serge Djoum Kouomou et Pr Begni Bagagna",
      year: 2023,
      abstract:
        "Ce mémoire cherche à comprendre comment la gestion matières influence le contrôle de la dépense publique au ministère de l'Agriculture et du Développement rural (MINADER). Selon une démarche qualitative inductive, les données ont été recueillies par des entretiens avec des cadres de la gestion matières et de la chaîne de la dépense publique, complétés par les rapports de gestion du ministère. L'analyse montre que les pratiques actuelles, limitées aux inventaires des biens meubles et immeubles, ne facilitent pas le contrôle de la dépense, et que le manque de collaboration et la place accordée à la gestion matières en limitent l'efficacité. L'étude recommande un cadre réglementaire plus contraignant en matière de gestion matières.",
      link: "",
      featured: false,
      i18n: {
        en: {
          title: "Materials management control and public expenditure control in Cameroon: the case of MINADER",
          venue: "Professional master's dissertation (Master II) in Public Finance, Audit and Control track — PSSFP, University of Yaoundé II, 2022-2023; supervised by Dr Serge Djoum Kouomou and Prof. Begni Bagagna",
          abstract:
            "This dissertation examines how materials management influences the control of public expenditure at the Ministry of Agriculture and Rural Development (MINADER). Using an inductive qualitative approach, data were gathered through interviews with materials management and expenditure-chain officers, supplemented by the ministry's management reports. The analysis shows that current practices, limited to inventories of movable and immovable property, do not facilitate expenditure control, and that a lack of collaboration and the limited role given to materials management reduce its effectiveness. The study recommends a more binding regulatory framework for materials management.",
        },
      },
    },
  },
];

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = process.argv.slice(2);
  if (files.length !== works.length) {
    console.error(`Indiquez ${works.length} fichiers PDF (thèse, mémoire Douala, mémoire PSSFP).`);
    process.exit(1);
  }
  for (const [i, w] of works.entries()) {
    const up = await sb.storage.from("dr-media").upload(w.file, readFileSync(files[i]), { contentType: "application/pdf", upsert: true, cacheControl: "31536000" });
    if (up.error) throw new Error(`${w.file} : ${up.error.message}`);
    const pdf_url = sb.storage.from("dr-media").getPublicUrl(w.file).data.publicUrl;
    const row = { ...w.row, pdf_url };
    const { data: existing } = await sb.from("dr_publications").select("id").eq("title", row.title).maybeSingle();
    const res = existing
      ? await sb.from("dr_publications").update(row).eq("id", existing.id)
      : await sb.from("dr_publications").insert(row);
    if (res.error) throw new Error(`${row.title} : ${res.error.message}`);
    console.log(`✓ ${existing ? "mis à jour" : "ajouté"} : ${row.title.slice(0, 60)}…`);
  }
}
