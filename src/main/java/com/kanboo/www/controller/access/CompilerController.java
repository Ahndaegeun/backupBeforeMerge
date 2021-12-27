package com.kanboo.www.controller.access;

import com.kanboo.www.dto.project.CompilerContentDTO;
import com.kanboo.www.dto.project.CompilerDTO;
import com.kanboo.www.dto.project.ProjectDTO;
import com.kanboo.www.service.inter.project.CompilerContentService;
import com.kanboo.www.service.inter.project.CompilerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/compiler")
public class CompilerController {

    private final CompilerService compilerService;
    private final CompilerContentService compilerContentService;

    @PostMapping("/getData")
    public List<CompilerDTO> getCompiler(@RequestBody ProjectDTO projectDTO) {
        if(projectDTO.getPrjctIdx() == null) {
            return null;
        }
        return compilerService.getList(projectDTO);
    }

    @PostMapping("/getFile")
    public CompilerContentDTO getFileDetail(@RequestBody CompilerDTO compilerDTO) {
        return compilerContentService.getFile(compilerDTO);
    }

    @PostMapping("/updateFile")
    public boolean updateFile(@RequestBody CompilerContentDTO compilerContentDTO) {
        return compilerContentService.updateFile(compilerContentDTO);
    }

    @PostMapping("/runCompile")
    public Map<String, String> runCompile(@RequestBody ProjectDTO projectDTO) {
        return compilerService.runMemberProject(projectDTO);
    }

}
