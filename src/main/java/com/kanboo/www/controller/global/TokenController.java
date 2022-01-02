package com.kanboo.www.controller.global;

import com.kanboo.www.domain.entity.member.Member;
import com.kanboo.www.domain.repository.member.MemberRepository;
import com.kanboo.www.security.JwtSecurityService;
import com.kanboo.www.service.inter.member.PageRoleCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/token")
public class TokenController {

    private final JwtSecurityService jwtSecurityService;
    private final PageRoleCheckService pageRoleCheckService;
    private final MemberRepository memberRepository;

    @PostMapping("/check")
    public Map<String, Object> tokenCheck(@RequestBody Map<String, Object> map) {
        Map<String, Object> resultMap = new HashMap<>();
        String exeToken = jwtSecurityService.getToken(map.get("token") + "");
        resultMap.put("isPm", null);
        if(exeToken != null) {
            resultMap.put("isRole", true);
        } else {
            resultMap.put("isRole", false);
        }
        return resultMap;
    }

    @PostMapping("/admin")
    public Map<String, Object> isAdmin(@RequestBody Map<String, String> map) {
        Map<String, Object> resultMap = new HashMap<>();
        String token = map.get("token");
        String memTag = jwtSecurityService.getToken(token);
        Member member = memberRepository.findByMemTag(memTag);
        resultMap.put("isPm", null);
        if(member.getRole().getRoleIdx() == 1) {
            resultMap.put("isRole", true);
        } else {
            resultMap.put("isRole", false);
        }
        return resultMap;
    }

    @PostMapping("/projectCheck")
    public Map<String, Object> projectTokenCheck(@RequestBody Map<String, Object> map) {
        String token = map.get("token") + "";
        Long projectIdx = map.get("projectIdx") != null ? Long.parseLong(map.get("projectIdx") + "") : null;
        return pageRoleCheckService.checkProject(token, projectIdx);
    }
}
