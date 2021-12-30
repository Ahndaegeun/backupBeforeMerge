package com.kanboo.www.service.impl.board;

import com.kanboo.www.domain.entity.board.Board;
import com.kanboo.www.domain.entity.board.Comment;
import com.kanboo.www.domain.entity.global.CodeDetail;
import com.kanboo.www.domain.entity.member.Member;
import com.kanboo.www.domain.repository.board.BoardRepository;
import com.kanboo.www.domain.repository.board.CommentRepository;
import com.kanboo.www.dto.board.BoardDTO;
import com.kanboo.www.dto.board.CommentDTO;
import com.kanboo.www.service.inter.board.BoardService;
import com.kanboo.www.service.inter.board.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final BoardService boardService;

    @Override
    public CommentDTO insertComment(CommentDTO commentDTO) {
        Member member = Member.builder()
                .memIdx(commentDTO.getMember().getMemIdx())
                .memNick(commentDTO.getMember().getMemNick())
                .build();
        Board board = Board.builder()
                .boardIdx(commentDTO.getBoard().getBoardIdx())
                .likesList(new HashSet<>())
                .reportsList(new HashSet<>())
                .member(new Member())
                .codeDetail(new CodeDetail())
                .build();

        Comment comment = Comment.builder()
                .answerCn(commentDTO.getAnswerCn())
                .answerDate(commentDTO.getAnswerDate())
                .answerDelAt(commentDTO.getAnswerDelAt())
                .board(board)
                .commentReportList(new ArrayList<>())
                .member(member)
                .build();

        Comment savedComment = commentRepository.save(comment);
        return savedComment.entityToDto();
    }

    @Override
    public CommentDTO updateComment(Map<String, Object> map) {
        Comment comment = commentRepository.findById(Long.parseLong(map.get("answerIdx") + "")).get();

        if(comment != null){
            comment.changeCommentCn(map.get("content") + "");
            Comment savedComment = commentRepository.save(comment);
            return savedComment.entityToDto();
        }

        return null;
    }

    @Override
    public CommentDTO deleteComment(Map<String, Object> map) {
        Comment comment = commentRepository.findById(Long.parseLong(map.get("answerIdx") + "")).get();

        if(comment != null){
            BoardDTO boardDTO = boardService.decreaseTotalComments(comment.getBoard().getBoardIdx());

            if (boardDTO != null){
                comment.changeAnswerDelAt("Y");
                Comment save = commentRepository.save(comment);
                return save.entityToDto();
            }
        }
        return null;
    }


}
