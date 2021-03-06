package com.kanboo.www.domain.repository.board.boardQueryDSL;

import com.kanboo.www.domain.entity.board.ProjectBoard;
import com.kanboo.www.dto.board.BoardDTO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectBoardDSLRepository {
    List<ProjectBoard> getDashBoardArticle(Long prjctIdx);
}
