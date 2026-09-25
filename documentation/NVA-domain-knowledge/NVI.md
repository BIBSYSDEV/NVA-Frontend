# Norsk vitenskapsindeks (NVI) / The Norwegian Scientific Index

NVI is an annual report on scientific outputs from education and research. The results of this reporting form part of
the funding basis for certain institutions, through calculating [Publication Points](#publication-points) that are used
in the funding formula.

The purpose of NVI reporting on scientific publications is to encourage increased research output and quality, as well
as national and international collaboration.

[NVI reporting](#nvi-reporting-in-nva) is carried out by registering results in NVA.

## Publication points

Publication points are the unit of credit that the Norwegian publication indicator produces. To calculate this number, a
lot of considerations are made, producing concepts such as author shares, publication form weight, level, and
collaboration, which can be explored in detail in the following sections.

The formula is:

> The number of publication points given an institution based on a registration =
> [The Weight of the Publication Form](#the-weight-of-the-publication-form-channel-register-level) × √([The institutions
> author shares on the publication / Total number of author shares on the publication](#author-shares-forfatterandeler))
> × [1.3 if the authorship is divided internationally, otherwise 1.0](#is-the-authorship-divided-internationally)

Before we go into the formula let's look into some of the terms used in the calculation. These also work to explain
which considerations are made when calculating the points.

### The weight of the publication form (Channel Register level)

**The weight of the publication form** is a way of differentiating between the different types of publications, since
there may be different amount of work behind them, the quality of the publication is considered higher, or other reasons
that some contributions are considered more valuable.

**The weights are as follows:**

| Publication form                  | Level 1 | Level 2 |
| --------------------------------- | ------- | ------- |
| Article in a journal or series    | 1       | 3       |
| Article in an anthology (chapter) | 0.7     | 1       |
| Monograph                         | 5       | 8       |

These are the only types of publications that are considered in NVI, and therefore the only types that have a weight.

The level is not a property of the publication itself, but of the **publication channel** — the **journal**, the
**series** or the **publisher** — as it is registered in the channel register). In NVA this is
stored as `scientificValue`, with the values `Unassigned`, `LevelZero`, `LevelOne` and
`LevelTwo` [See type declaration](../../src/types/registration.types.ts).

So as you can see, there are two factors that determine the weight of the publication form:

- the **type of publication** (article in journal or series, chapter in anthology or monograph)
- and the **level of the journal/series, anthology or monograph** where the publication is published (level 1 or level
  2).

To complicate matters further for monographs and chapters: If a book belongs to a series that has been assigned a level,
the book will inherit the level of the series. If the book is not part of a series, it will be assigned the level of the
publisher.

Level 2 is reserved for the most prestigious channels within each discipline, and the proportion of level 2 channels is
capped. This represents the quality selection.

### Author shares (Forfatterandeler)

Author shares describe how big part of a publication "belongs" to a given institution in NVI. The points attributed to a
registration are divided between the authors of the publication, which in turn are divided between the institutions of
the author, where one share is called an author share. The total number of author shares is the sum of all the authors
and their affiliations.

> I.e: If a publication has 6 authors, and one of the authors has 2 affiliations, the total number of author shares will
> be 7, one for each author and one for the second affiliation of the author with 2 affiliations.

These shares decide how the publication points are divided between the institutions.

**The share of the institution** is the **number of author shares the institution owns, divided by the total number of
author shares on the publication**.

> I.e. If a publication has 3 authors, where Author 1 belongs to Institution A and Institution B, Author 2 belongs to
> Institution A, and Author 3 belongs to Institution C: The total number of author shares is 2 + 1 + 1 = 4, one unit for
> each affiliation of an author (see table 1).

#### Table 1: Author shares

| Author    | Affiliations                 | Author shares |
| --------- | ---------------------------- | ------------- |
| Author 1  | Institution A, Institution B | 2             |
| Author 2  | Institution A                | 1             |
| Author 3  | Institution C                | 1             |
| **Total** |                              | **4**         |

> In this example, Institution A will have 2 author shares (1 from Author 1 and 1 from Author 2), Institution B has 1
> author share (from Author 1), and Institution C has 1 author share (from Author 3) (see table 2).

#### Table 2: Author shares divided by institutions

| Institution   | Author shares | From               | Proportion of total |
| ------------- | ------------- | ------------------ | ------------------- |
| Institution A | 2             | Author 1, Author 2 | 2/4 = 50 %          |
| Institution B | 1             | Author 1           | 1/4 = 25 %          |
| Institution C | 1             | Author 3           | 1/4 = 25 %          |
| **Total**     | **4**         |                    | **100 %**           |

### Is the authorship divided internationally

**International collaboration** is rewarded with a fixed multiplier. If the authorship of a publication is divided
internationally, the publication points of every participating institution are multiplied by **1.3**. If it is not, the
factor is **1.0** and has no effect.

A publication counts as internationally divided when at least one of its author shares belongs to an institution outside
Norway. The foreign institution does not have to be a reporting institution — it only has to appear as an affiliation on
one of the authors.

### Back to the formula

> publication points = weight of publication form × √(institution's author shares / total author shares) × collaboration
> factor

As we can se here, a point bundles three separate judgements: how substantial the publication form is and how
prestigious the channel is (the weight), how much of it belongs to your institution, where the square root ensures that
big institutions don't get a propotionally big part of the cake (the author share fraction), and whether the publication
is a result of international collaboration (the collaboration factor).

## NVI reporting in NVA

NVI reporting is based on the registering of results in NVA. In an annual cycle, qualifying registrations become
**candidates** in NVA, NVI curators control them within a [reporting period](#the-reporting-period), and when the period
is reported the numbers are final and passed on as part of the funding basis.

### The reporting period

There is one reporting period per publication year. Periods are created and maintained by an app administrator under
Master Data → NVI, and a year can only have one period. The period has three properties: the **publishing year** (which
cannot be changed after the period is created), a **start date** and a **reporting date**.

The start date and the reporting date control when the period opens and closes. Once the reporting date has passed, the
period closes and NVI curators can no longer control candidates — but the period can be reported. Changing the reporting
date reopens the period.

The earliest publication year NVA offers for NVI is 2011 ([see `minNviYear`](../../src/utils/nviHelpers.ts)).

#### Table 3: Reporting period statuses

| Status           | Meaning                                                        |
| ---------------- | -------------------------------------------------------------- |
| `UnopenedPeriod` | The period exists, but the start date has not been reached yet |
| `OpenPeriod`     | Curators can control candidates                                |
| `ClosedPeriod`   | The reporting date has passed; control is no longer possible   |
| `ReportedPeriod` | The period has been reported and the numbers are final         |
| `NoPeriod`       | No period exists for the year at all                           |

[See type declaration](../../src/types/nvi.types.ts)

### NVI candidates

A registration is never explicitly set to be a candidate by a user. Whenever a registration is published or changed, it
is evaluated against the NVI criteria — category, channel level, and the other requirements described above — and
becomes a candidate if it qualifies. Editing a registration can therefore make it become a candidate, stop being one,
or have its author shares recalculated.

> I.e: Adding an affiliation to a contributor changes the total number of author shares on the publication, which
> changes
> the share — and the points — of every institution involved.

Each candidate carries **one approval per participating institution**. Every institution decides for itself, and each
approval has its own status, its own assignee and its own points.

### Controlling a candidate

Only users with the NVI curator role can control candidates. Candidates can be found in the curators
[candidate search](http://dev.nva.sikt.no/tasks/nvi), and clicking a candidate from the results leads to the candidate
page, which shows the registration itself, with an NVI dialogue panel beside it. From that panel a curator can:

- **approve** the candidate on behalf of their institution,
- **reject** it, which requires a reason,
- **reset** an approval that has already been made,
- **assign** the candidate to a curator, so it is clear who is handling it,
- and **write notes**, which form a shared dialogue on the candidate.

Which of the operations are available at any given time (except assigning curator) is decided by the backend and
delivered with the candidate as `allowedOperations`, so the panel never offers an action the period or the current
status does not allow. If the period is closed or missing, the panel says so and control is blocked.

The panel also surfaces **problems** on the candidate. The most important one is an unverified contributor
(`UnverifiedCreatorExists` and `UnverifiedCreatorFromOrganizationProblem`): a contributor who is not linked to an
identified person cannot be reliably attributed to an institution, so the registration needs to be corrected before the
candidate is approved.

#### Table 4: The institution's own approval status

| Status     | Meaning                                                   |
| ---------- | --------------------------------------------------------- |
| `New`      | The candidate has not been handled by the institution yet |
| `Pending`  | The candidate is being worked on                          |
| `Approved` | The institution has approved the candidate                |
| `Rejected` | The institution has rejected the candidate, with a reason |

### The publication's overall report status

An institution's own decision is only part of the picture. A publication is only reported when every participating
institution agrees, so NVA also tracks an overall status for the publication across all of them.

#### Table 5: Overall report status

| Status           | Meaning                                                 |
| ---------------- | ------------------------------------------------------- |
| `NOT_CANDIDATE`  | The registration does not qualify for NVI               |
| `PENDING_REVIEW` | Awaiting approval from all institutions                 |
| `UNDER_REVIEW`   | At least one institution has approved or rejected       |
| `APPROVED`       | Approved by all involved institutions in an open period |
| `REJECTED`       | Rejected by all involved institutions in an open period |
| `NOT_REPORTED`   |                                                         |
| `REPORTED`       | Reported in a closed period                             |

[See type declaration](../../src/api/scientificIndexApi.ts)

When institutions disagree — one approves and another rejects the same publication — the candidate goes into **dispute
**.
Disputes have [their own page](http://dev.nva.sikt.no/tasks/nvi/disputes) for NVI curators, because they cannot be
solved by one institution alone: they have to be resolved between the institutions involved.

### Following the progress

Three roles follow the reporting, each with their own view of the same two pages: reporting status and publication
points.

#### Table 6: Who sees what

| Role               | Scope            | Capabilities                                                    | Publication points                  | Reporting status                  |
| ------------------ | ---------------- | --------------------------------------------------------------- | ----------------------------------- | --------------------------------- |
| NVI curator        | Own institution  | Controls candidates; tables contain links into candidate search | /tasks/nvi/publication-points       | /tasks/nvi/status                 |
| Institution editor | Own institution  | Read-only overview of the institution's progress                | /institution/nvi/publication-points | /institution/nvi/reporting-status |
| App administrator  | All institutions | Creates periods; filters by sector and institution              | /basic-data/nvi/publication-points  | /basic-data/nvi/status            |

[The publication points page](http://dev.nva.sikt.no/tasks/nvi/publication-points) breaks the institution down by unit,
showing how many candidates the institution has approved, how many are still waiting for other institutions, how many
are approved by everyone, and the resulting points. Candidates in dispute are not shown in that table.

### Exporting the data

Two exports are available from the publication points page:

- **Author shares** — an Excel file with one row per author share, which is the detailed basis for the reporting.
- **Publication points** — a CSV file with the aggregated points, available to app administrators for all institutions.

The author shares file contains candidates that are approved or still under control. Candidates rejected by one or more
institutions are not included.
