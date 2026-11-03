import { Student, Intervention, NotificationItem, ModelWeights } from '@/types';

export interface ChatContextData {
  students: Student[];
  interventions: Intervention[];
  notifications: NotificationItem[];
  weights: ModelWeights;
  activeRole: string;
}

export function generateSmartAIResponse(query: string, context: ChatContextData): string {
  if (!query || !query.trim()) {
    return 'Please enter a query about student performance, EMIS records, department stats, or faculty advisors.';
  }

  // 100% Case-Insensitive normalization
  const q = query.trim().toLowerCase();
  const { students, interventions, weights } = context;

  // 1. Case-Insensitive Student Name / EMIS / ID / Phone / Email Matching across ALL 59 Students
  const matchedStudent = students.find((s) => {
    const sName = s.name.toLowerCase();
    const sEmis = s.emis.toLowerCase();
    const sId = s.id.toLowerCase();
    const sEmail = s.email.toLowerCase();
    const sAadhar = s.aadhar.toLowerCase();

    // Check if query contains any student token
    if (q.includes(sName) || q.includes(sEmis) || q.includes(sId) || q.includes(sEmail) || q.includes(sAadhar)) {
      return true;
    }

    // Split name words (e.g. "ABISHEK", "RAHUL", "DRAVID", "CRISTINA", "BHUVANESHWARI")
    const nameParts = sName.split(' ').filter((p) => p.length > 2);
    return nameParts.some((part) => q.includes(part));
  });

  if (matchedStudent) {
    const weakestSub = [...matchedStudent.subjects].sort((a, b) => a.score - b.score)[0];
    const bestSub = [...matchedStudent.subjects].sort((a, b) => b.score - a.score)[0];
    const activeInt = interventions.find((i) => i.studentName.toLowerCase() === matchedStudent.name.toLowerCase());

    return `📊 **Comprehensive Student Record & Report for ${matchedStudent.name}**:
- **Student ID**: ${matchedStudent.id} | **EMIS Number**: ${matchedStudent.emis}
- **Aadhar ID**: ${matchedStudent.aadhar}
- **Department**: ${matchedStudent.department} (Year ${matchedStudent.year}, Sec ${matchedStudent.section})
- **Contact Email**: ${matchedStudent.email} | **Phone**: ${matchedStudent.phone}
- **Class Advisor**: ${matchedStudent.mentorName || 'Dr. S. Ramanathan'}

📈 **Academic & Risk Metrics**:
- **Risk Level**: **${matchedStudent.riskLevel} RISK** (${matchedStudent.trend === 'UP' ? '↑ Improving' : matchedStudent.trend === 'DOWN' ? '↓ Declining' : '→ Stable'})
- **Predicted Score**: **${matchedStudent.predictedScore}%** | **Attendance**: **${matchedStudent.attendance}%** (Threshold 75%)
- **Assignment Completion**: ${matchedStudent.assignmentCompletion}% | **Internal Assessment**: ${matchedStudent.assessmentScore}%
- **Strongest Subject**: ${bestSub.name} (${bestSub.score}%)
- **Weakest Subject**: ${weakestSub.name} (${weakestSub.score}%)

⚠️ **Explainable Risk Factors**:
${matchedStudent.riskFactors.map((rf) => `  • [${rf.impact}] ${rf.factor}: ${rf.description}`).join('\n') || '  • No critical risk factors identified.'}

${activeInt ? `🛠️ **Active Intervention**: ${activeInt.recommendedIntervention} (${activeInt.status}) - Notes: "${activeInt.notes}"` : '🛠️ **Intervention Status**: No pending interventions. Recommended practice sets for ' + weakestSub.name + '.'}`;
  }

  // 2. Faculty Roster & Department Advisor queries
  if (q.includes('faculty') || q.includes('advisor') || q.includes('teacher') || q.includes('mentor') || q.includes('staff')) {
    return `👨‍🏫 **Institutional Faculty Roster & Class Advisors**:
1. **Dr. S. Ramanathan** — Head of Department & Class Advisor, **AI & DS** (22 Students)
2. **Prof. K. Venkatesh** — Senior Assistant Professor, **CSE** (15 Students)
3. **Dr. M. Lakshmi** — Associate Professor, **ECE** (8 Students)
4. **Prof. P. Anand** — Assistant Professor, **MECH** (5 Students)
5. **Prof. S. Geetha** — Assistant Professor, **IT** (6 Students)
6. **Dr. R. Karthik** — Assistant Professor, **EEE** (3 Students)

*All faculty members can log in to view student predictions and upload batch class marksheets.*`;
  }

  // 3. Department-Specific Queries (Case-Insensitive for all 6 departments)
  if (
    q.includes('department') ||
    q.includes('dept') ||
    q.includes('cse') ||
    q.includes('ai & ds') ||
    q.includes('aids') ||
    q.includes('ai') ||
    q.includes('ece') ||
    q.includes('mech') ||
    q.includes('eee') ||
    q.includes('it')
  ) {
    let targetDept = '';
    if (q.includes('cse')) targetDept = 'CSE';
    else if (q.includes('ai & ds') || q.includes('aids') || q.includes('ai')) targetDept = 'AI & DS';
    else if (q.includes('ece')) targetDept = 'ECE';
    else if (q.includes('mech')) targetDept = 'MECH';
    else if (q.includes('eee')) targetDept = 'EEE';
    else if (q.includes('it')) targetDept = 'IT';

    if (targetDept) {
      const deptStudents = students.filter((s) => s.department === targetDept);
      const avgScore = Math.round(deptStudents.reduce((acc, s) => acc + s.predictedScore, 0) / (deptStudents.length || 1));
      const avgAtt = Math.round(deptStudents.reduce((acc, s) => acc + s.attendance, 0) / (deptStudents.length || 1));
      const highRisk = deptStudents.filter((s) => s.riskLevel === 'HIGH');

      return `🏫 **Department Performance Report for ${targetDept}**:
- **Total Enrolled Students**: ${deptStudents.length}
- **Average Performance Score**: **${avgScore}%**
- **Average Attendance**: **${avgAtt}%**
- **High Risk Count**: **${highRisk.length} Students** (${highRisk.map((s) => s.name).join(', ') || 'None'})
- **Class Advisor**: ${targetDept === 'AI & DS' ? 'Dr. S. Ramanathan' : targetDept === 'CSE' ? 'Prof. K. Venkatesh' : 'Department Faculty'}`;
    }
  }

  // 4. Attendance & Low-Attendance Risk Filtering Queries
  if (q.includes('attendance') || q.includes('absent') || q.includes('below 75') || q.includes('low attendance')) {
    const lowAttStudents = students.filter((s) => s.attendance < 75);
    return `📅 **Attendance Risk Report (<75% Threshold)**:
Total **${lowAttStudents.length} students** have attendance below institutional requirement:
${lowAttStudents.slice(0, 8).map((s) => `• **${s.name}** (${s.department}) — Attendance: **${s.attendance}%** (Predicted Score: ${s.predictedScore}%)`).join('\n')}
${lowAttStudents.length > 8 ? `\n...and ${lowAttStudents.length - 8} more students.` : ''}

*Action Recommended*: Dispatch parent SMS/Email alert or schedule attendance counseling.`;
  }

  // 5. Subject Specific Performance Queries (Mathematics, Python, DBMS, Java, AI)
  if (q.includes('math') || q.includes('mathematics') || q.includes('python') || q.includes('dbms') || q.includes('java')) {
    return `📚 **Subject Analytics & Pass Rates**:
- **Mathematics**: Institutional Average **56.4%** (Weakest Subject - 61% Pass Rate).
- **Python**: Institutional Average **79.4%** (92% Pass Rate).
- **DBMS**: Institutional Average **73.8%** (85% Pass Rate).
- **Java**: Institutional Average **71.2%** (82% Pass Rate).
- **AI & ML**: Institutional Average **76.5%** (88% Pass Rate).

Students with weak Math scores (<60%) are assigned 6-day study schedules and matched with top-performing peer buddies.`;
  }

  // 6. High Risk / Critical Student List Queries
  if (q.includes('high risk') || q.includes('critical') || q.includes('failing') || q.includes('risk list')) {
    const highRiskStudents = students.filter((s) => s.riskLevel === 'HIGH');
    return `🚨 **High Risk Student Roster (${highRiskStudents.length} Students)**:
${highRiskStudents.map((s) => `• **${s.name}** (${s.department}) — Score: **${s.predictedScore}%**, Attendance: **${s.attendance}%** (Issue: ${s.riskFactors[0]?.factor || 'Marks decline'})`).join('\n')}

*Intervention Center*: You can mark interventions as completed or generate personalized remedial study plans.`;
  }

  // 7. Prediction Logic Explanation
  if (q.includes('formula') || q.includes('algorithm') || q.includes('weight') || q.includes('predict') || q.includes('how')) {
    return `⚡ **Kalvikkan AI Prediction Scoring Formula**:
Performance Score is calculated using a deterministic transparent weighted model:
- **${weights.previousScoreWeight * 100}%**: Previous Academic Marks
- **${weights.attendanceWeight * 100}%**: Attendance Percentage
- **${weights.assignmentWeight * 100}%**: Assignment Completion Rate
- **${weights.assessmentWeight * 100}%**: Internal Assessment Average
- **${weights.quizWeight * 100}%**: Continuous Quiz Average

**Risk Classification Thresholds**:
- **HIGH RISK**: Score < ${weights.highRiskThreshold}%
- **MEDIUM RISK**: Score between ${weights.highRiskThreshold}% and ${weights.mediumRiskThreshold}%
- **LOW RISK**: Score ≥ ${weights.mediumRiskThreshold}%`;
  }

  // Default smart case-insensitive fallback with suggestions
  return `💡 **Kalvikkan AI Intelligence Answer**:
I searched all **${students.length} student records** in the active dataset. 

You can ask me about:
1. **Specific Student Names or EMIS**: e.g., *"How is Abishek S doing?"*, *"Details for Rahul Dravid M"*, *"Show EMIS 1015279305"*
2. **Department Stats**: e.g., *"CSE performance"*, *"AI & DS risk list"*
3. **Faculty Advisors**: e.g., *"Faculty list"*, *"Who is advisor for ECE?"*
4. **Attendance Alerts**: e.g., *"Students with attendance below 75%"*`;
}
