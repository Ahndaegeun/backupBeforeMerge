package com.kanboo.www.dto.project;

import com.kanboo.www.domain.entity.project.Gantt;
import com.kanboo.www.domain.entity.project.Project;
import com.kanboo.www.dto.member.MemberDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GanttDTO {

    private Long gtIdx;
    private ProjectDTO project;
    private String gtState;
    private String gtPriority;
    private int gtProgress;
    private LocalDateTime gtStartDate;
    private LocalDateTime gtEndDate;
    private String gtExplanation;
    private String gtTitle;
    private MemberDTO member;

    public Gantt dtoToEntity() {
        return Gantt.builder()
                .gtIdx(gtIdx)
                .project(project.dtoToEntity())
                .gtState(gtState)
                .gtPriority(gtPriority)
                .gtProgress(gtProgress)
                .gtStartDate(gtStartDate)
                .gtEndDate(gtEndDate)
                .gtExplanation(gtExplanation)
                .gtTitle(gtTitle)
                .build();
    }
}
